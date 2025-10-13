import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityPost } from "@/components/CommunityPost";
import Header from "@/components/Header";
import { useApp } from "@/contexts/AppContext";

const Community = () => {
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data - in production this would come from the database
  const posts = [
    {
      id: 1,
      userName: "Sarah Chen",
      belief: "Buddhist",
      location: "Angkor Wat, Cambodia",
      content: "Standing here, I feel the weight of centuries of devotion. May all beings find peace.",
      type: "wish" as const,
    },
    {
      id: 2,
      userName: "Ahmed Hassan",
      belief: "Muslim",
      location: "Al-Azhar Mosque, Cairo",
      content: "The morning call to prayer echoing through these ancient halls fills my heart with gratitude.",
      imageUrl: "/placeholder.svg",
      type: "photo" as const,
    },
    {
      id: 3,
      userName: "Maria Garcia",
      belief: "Catholic",
      location: "Sagrada Familia, Barcelona",
      content: "Gaudí's vision reminds us that faith and beauty are eternally intertwined.",
      type: "quote" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2 gold-halo">
          <h1 className="text-3xl font-bold text-foreground">
            {t("community.title", "Community")}
          </h1>
          <p className="text-muted-foreground">
            {t("community.subtitle", "Share your wishes and memories with the world")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="flex-1">
            <TabsList className="grid grid-cols-5 w-full bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="wishes" className="text-xs">Wishes</TabsTrigger>
              <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
              <TabsTrigger value="quotes" className="text-xs">Quotes</TabsTrigger>
              <TabsTrigger value="memories" className="text-xs">Memories</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            className="bg-primary text-primary-foreground shadow-turquoise breathing-glow"
            size="icon"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <CommunityPost key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
