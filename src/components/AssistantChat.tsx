import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MessageCircle, Send, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Parse quick replies from message content
const parseQuickReplies = (content: string): { text: string; suggestions: Array<{ label: string; message: string }> } => {
  const regex = /<lov-actions>([\s\S]*?)<\/lov-actions>/;
  const match = content.match(regex);
  
  if (!match) {
    return { text: content, suggestions: [] };
  }
  
  const text = content.replace(regex, '').trim();
  const suggestionsRegex = /<lov-suggestion message="([^"]+)">([^<]+)<\/lov-suggestion>/g;
  const suggestions: Array<{ label: string; message: string }> = [];
  
  let suggestionMatch;
  while ((suggestionMatch = suggestionsRegex.exec(match[1])) !== null) {
    suggestions.push({
      message: suggestionMatch[1],
      label: suggestionMatch[2],
    });
  }
  
  return { text, suggestions };
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Mode = "help" | "history";

const AssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("help");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const location = useLocation();
  const { placeId } = useParams<{ placeId?: string }>();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendWithMessage = async (messageContent: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("sacred-assistant", {
        body: {
          message: messageContent,
          mode,
          currentRoute: location.pathname,
          selectedPlaceId: placeId || null,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Assistant error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de contacter l'assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await handleSendWithMessage(userMessage.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 animate-pulse hover:animate-none"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assistant Sacred World
          </SheetTitle>
          
          {/* Mode Toggle */}
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => value && setMode(value as Mode)}
            className="justify-start mt-2"
          >
            <ToggleGroupItem value="help" aria-label="Mode aide" className="gap-1.5">
              <HelpCircle className="h-4 w-4" />
              Aide dans l'app
            </ToggleGroupItem>
            <ToggleGroupItem value="history" aria-label="Mode histoire" className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              Histoire
            </ToggleGroupItem>
          </ToggleGroup>
        </SheetHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {mode === "help" 
                    ? "Posez vos questions sur l'application !" 
                    : "Découvrez l'histoire des lieux sacrés !"}
                </p>
              </div>
            )}
            
            {messages.map((message, index) => {
              const isLastAssistant = message.role === "assistant" && index === messages.length - 1;
              const { text, suggestions } = message.role === "assistant" 
                ? parseQuickReplies(message.content)
                : { text: message.content, suggestions: [] };
              
              return (
                <div key={message.id}>
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{text}</p>
                    </div>
                  </div>
                  
                  {/* Quick replies for last assistant message */}
                  {isLastAssistant && suggestions.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-start">
                      {suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-1.5 px-3"
                          onClick={() => {
                            const userMessage: Message = {
                              id: crypto.randomUUID(),
                              role: "user",
                              content: suggestion.message,
                            };
                            setMessages((prev) => [...prev, userMessage]);
                            handleSendWithMessage(suggestion.message);
                          }}
                        >
                          {suggestion.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2.5">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === "help" ? "Comment puis-je vous aider ?" : "Quel lieu vous intéresse ?"}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AssistantChat;
