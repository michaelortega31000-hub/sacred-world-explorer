import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Sparkles, Heart, Hand } from "lucide-react";
import { useState } from "react";

interface CommunityPostProps {
  userName: string;
  belief: string;
  location: string;
  content: string;
  imageUrl?: string;
  type: "wish" | "photo" | "quote" | "memory";
}

export const CommunityPost = ({
  userName,
  belief,
  location,
  content,
  imageUrl,
  type,
}: CommunityPostProps) => {
  const [reactions, setReactions] = useState({
    sparkle: 0,
    heart: 0,
    hands: 0,
  });

  const handleReaction = (reaction: keyof typeof reactions) => {
    setReactions((prev) => ({
      ...prev,
      [reaction]: prev[reaction] + 1,
    }));
  };

  return (
    <Card className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 turquoise-reflection">
      {imageUrl && (
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={content}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{belief}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>

        <p className="text-sm text-foreground/90 line-clamp-3">{content}</p>

        <div className="flex items-center gap-4 pt-2 border-t border-primary/10">
          <button
            onClick={() => handleReaction("sparkle")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {reactions.sparkle > 0 && <span>{reactions.sparkle}</span>}
          </button>
          <button
            onClick={() => handleReaction("heart")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className="w-4 h-4" />
            {reactions.heart > 0 && <span>{reactions.heart}</span>}
          </button>
          <button
            onClick={() => handleReaction("hands")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Hand className="w-4 h-4" />
            {reactions.hands > 0 && <span>{reactions.hands}</span>}
          </button>
        </div>
      </div>
    </Card>
  );
};
