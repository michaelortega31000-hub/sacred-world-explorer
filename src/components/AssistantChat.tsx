import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MessageCircle, Send, Loader2, Sparkles, HelpCircle, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
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

type Suggestion = {
  label: string;
  message: string;
};

const normalizeRoute = (pathname: string) => {
  if (/^\/place\/[^/]+$/.test(pathname)) return "/place/:id";
  if (/^\/country\/[^/]+$/.test(pathname)) return "/country/:id";
  if (/^\/u\/[^/]+$/.test(pathname)) return "/u/:username";
  if (/^\/user\/[^/]+$/.test(pathname)) return "/user/:userId";
  if (/^\/world\/.+$/.test(pathname)) return "/world/*";
  return pathname;
};

const getInitialSuggestions = (route: string, mode: Mode): Suggestion[] => {
  const r = normalizeRoute(route);

  if (mode === "history") {
    if (r === "/place/:id") {
      return [
        { label: "📅 Dates clés", message: "Donne-moi les dates clés de ce lieu." },
        { label: "✨ Anecdote", message: "Raconte-moi une anecdote sur ce lieu." },
        { label: "🔎 Contexte", message: "Quel est le contexte historique de ce lieu ?" },
      ];
    }
    if (r === "/country/:id") {
      return [
        { label: "🗺️ Lieux sacrés", message: "Quels sont les lieux sacrés majeurs de ce pays ?" },
        { label: "📚 Traditions", message: "Quelles traditions sont importantes dans ce pays ?" },
        { label: "📅 3 faits", message: "Donne-moi 3 faits historiques marquants." },
      ];
    }
    return [
      { label: "📚 Lieu célèbre", message: "Propose-moi un lieu sacré célèbre et explique pourquoi." },
      { label: "✨ Anecdote", message: "Raconte-moi une anecdote historique surprenante." },
      { label: "🔎 Lieu méconnu", message: "Propose-moi un lieu sacré méconnu à découvrir." },
    ];
  }

  switch (r) {
    case "/traditions":
      return [
        { label: "📚 Découvrir", message: "Je veux découvrir une tradition." },
        { label: "🎲 Au hasard", message: "Propose-moi une tradition au hasard." },
        { label: "📅 3 faits", message: "Donne-moi 3 faits historiques sur une tradition." },
      ];
    case "/explore":
      return [
        { label: "🔎 Près de moi", message: "Trouve-moi des lieux près de moi." },
        { label: "🧭 Filtrer", message: "Aide-moi à filtrer (tradition / distance)." },
        { label: "✨ Itinéraire", message: "Fais-moi un itinéraire d'1h autour de moi." },
      ];
    case "/place/:id":
      return [
        { label: "📅 Dates clés", message: "Donne-moi les dates clés de ce lieu." },
        { label: "📜 Anecdote", message: "Raconte-moi une anecdote sur ce lieu." },
        { label: "🗺️ Voir autour", message: "Qu'est-ce qu'il y a à voir autour ?" },
      ];
    case "/profile":
      return [
        { label: "👤 Modifier", message: "Comment modifier mon profil ?" },
        { label: "🧿 Avatar", message: "Comment choisir un avatar ?" },
        { label: "🏅 Badges", message: "Comment gagner des badges ?" },
      ];
    case "/calendar":
      return [
        { label: "📅 Prochains", message: "Que dois-je regarder dans le calendrier ?" },
        { label: "🔔 Rappel", message: "Je veux créer un rappel." },
        { label: "✨ Ce mois", message: "Qu'est-ce que je peux planifier ce mois-ci ?" },
      ];
    case "/country/:id":
      return [
        { label: "🗺️ Lieux sacrés", message: "Quels sont les lieux sacrés de ce pays ?" },
        { label: "📚 Traditions", message: "Parle-moi des traditions de ce pays." },
        { label: "📅 3 faits", message: "Donne-moi 3 faits historiques." },
      ];
    default:
      return [
        { label: "🗺️ Explorer", message: "Aide-moi à utiliser la page Explorer." },
        { label: "🔎 Aide", message: "Où suis-je dans l'app et que puis-je faire ici ?" },
        { label: "📚 Traditions", message: "Explique-moi comment fonctionne la section Traditions." },
      ];
  }
};

interface AssistantChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssistantChat = ({ isOpen, onOpenChange }: AssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("help");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const location = useLocation();
  const { placeId } = useParams<{ placeId?: string }>();

  // Voice hooks
  const { 
    isListening, 
    transcript, 
    isSupported: speechRecognitionSupported, 
    startListening, 
    stopListening,
    resetTranscript 
  } = useSpeechRecognition();



  const initialSuggestions = useMemo(
    () => getInitialSuggestions(location.pathname, mode),
    [location.pathname, mode]
  );

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-send when listening stops and we have a transcript
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      // Small delay to ensure the transcript is complete
      const timer = setTimeout(() => {
        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: "user",
          content: transcript.trim(),
        };
        setMessages((prev) => [...prev, userMessage]);
        handleSendWithMessage(transcript.trim());
        resetTranscript();
        setInput("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript]);

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

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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

          {/* Voice options */}
          {(speechRecognitionSupported || speechSynthesisSupported) && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t">
              {speechSynthesisSupported && (
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-speak"
                    checked={autoSpeak}
                    onCheckedChange={setAutoSpeak}
                  />
                  <Label htmlFor="auto-speak" className="text-xs cursor-pointer">
                    {isSpeaking ? (
                      <span className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3 animate-pulse" /> Lecture...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" /> Réponse vocale
                      </span>
                    )}
                  </Label>
                  {isSpeaking && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={stopSpeaking}
                    >
                      <VolumeX className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </SheetHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  {mode === "help" 
                    ? "Posez vos questions sur l'application !" 
                    : "Découvrez l'histoire des lieux sacrés !"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {initialSuggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1.5 px-3"
                      disabled={isLoading}
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
          {/* Listening indicator */}
          {isListening && (
            <div className="flex items-center justify-center gap-2 mb-3 text-primary">
              <div className="flex gap-1">
                <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2 bg-primary rounded-full animate-pulse delay-150" />
              </div>
              <span className="text-sm font-medium">Je vous écoute...</span>
            </div>
          )}
          
          <div className="flex gap-2">
            {/* Microphone button */}
            {speechRecognitionSupported && (
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleListening}
                disabled={isLoading}
                className={`shrink-0 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                title={isListening ? "Arrêter l'écoute" : "Parler à l'assistant"}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Parlez maintenant..." : (mode === "help" ? "Comment puis-je vous aider ?" : "Quel lieu vous intéresse ?")}
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
