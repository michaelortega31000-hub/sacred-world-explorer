import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Plus, Send, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Topic {
  id: string;
  title: string;
  description: string;
  author_id: string;
  created_at: string;
  views_count: number;
  posts_count: number;
  author?: {
    username: string;
  };
}

interface Post {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  author?: {
    username: string;
  };
}

const ForumTab = () => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadPosts(selectedTopic.id);
      incrementViewCount(selectedTopic.id);
    }
  }, [selectedTopic]);

  const loadTopics = async () => {
    const { data, error } = await supabase
      .from('forum_topics')
      .select(`
        *,
        author:profiles!forum_topics_author_id_fkey(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des topics');
    } else {
      setTopics(data || []);
    }
  };

  const loadPosts = async (topicId: string) => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles!forum_posts_author_id_fkey(username)
      `)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des posts');
    } else {
      setPosts(data || []);
    }
  };

  const incrementViewCount = async (topicId: string) => {
    const { data: topic } = await supabase
      .from('forum_topics')
      .select('views_count')
      .eq('id', topicId)
      .single();

    if (topic) {
      await supabase
        .from('forum_topics')
        .update({ views_count: topic.views_count + 1 })
        .eq('id', topicId);
    }
  };

  const createTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicDescription.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    const { error } = await supabase
      .from('forum_topics')
      .insert({
        title: newTopicTitle,
        description: newTopicDescription,
        author_id: user.id,
      });

    if (error) {
      toast.error('Erreur lors de la création du topic');
    } else {
      toast.success('Topic créé avec succès');
      setNewTopicTitle('');
      setNewTopicDescription('');
      setIsCreateDialogOpen(false);
      loadTopics();
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim() || !selectedTopic) {
      toast.error('Veuillez écrire un message');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    const { error } = await supabase
      .from('forum_posts')
      .insert({
        topic_id: selectedTopic.id,
        content: newPostContent,
        author_id: user.id,
      });

    if (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } else {
      setNewPostContent('');
      loadPosts(selectedTopic.id);
      loadTopics(); // Refresh to update post count
    }
  };

  if (selectedTopic) {
    return (
      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        <Button variant="outline" onClick={() => setSelectedTopic(null)}>
          ← Retour aux topics
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{selectedTopic.title}</CardTitle>
            <CardDescription>
              Par {selectedTopic.author?.username} • {formatDistanceToNow(new Date(selectedTopic.created_at), { addSuffix: true, locale: fr })}
            </CardDescription>
            <p className="text-sm mt-2">{selectedTopic.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {selectedTopic.views_count} vues
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {selectedTopic.posts_count} réponses
              </span>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="mt-1">
                    <AvatarFallback>{post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{post.author?.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm">{post.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Écrire une réponse..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />
              <Button onClick={createPost}>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau topic</DialogTitle>
              <DialogDescription>
                Partagez vos idées et commencez une discussion
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Titre du topic"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description..."
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                rows={4}
              />
              <Button onClick={createTopic} className="w-full">
                Créer le topic
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {topics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Aucun topic pour le moment. Soyez le premier à créer une discussion !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Card key={topic.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setSelectedTopic(topic)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Par {topic.author?.username} • {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: fr })}
                    </CardDescription>
                    <p className="text-sm mt-2 line-clamp-2">{topic.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground ml-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {topic.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {topic.posts_count}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumTab;
