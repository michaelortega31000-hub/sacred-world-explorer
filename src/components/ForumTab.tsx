import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MessageSquare, Plus, Send, Eye, Flag, Shield, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { z } from 'zod';
import { useRateLimit } from '@/hooks/useRateLimit';

// Validation schemas with HTML sanitization
const noHtmlRegex = /<[^>]*>/g;

const topicSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
  description: z.string()
    .trim()
    .min(1, 'La description est requise')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
});

const postSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Le message est requis')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
});

const reportSchema = z.object({
  reason: z.string()
    .trim()
    .min(10, 'La raison doit contenir au moins 10 caractères')
    .max(500, 'La raison ne peut pas dépasser 500 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
});

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
  is_hidden: boolean;
  hidden_reason?: string;
  hidden_at?: string;
  author?: {
    username: string;
  };
  report_count?: number;
}

interface Report {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
  post?: Post;
  reporter?: {
    username: string;
  };
}

const ForumTab = () => {
  const { t } = useTranslation();
  const { session } = useApp();
  const { checkRateLimit } = useRateLimit();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isModerator, setIsModerator] = useState(false);
  const [hidePostId, setHidePostId] = useState<string | null>(null);
  const [hideReason, setHideReason] = useState('');
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
    checkModeratorStatus();
  }, [session]);

  useEffect(() => {
    if (isModerator) {
      loadReports();
    }
  }, [isModerator]);

  useEffect(() => {
    if (selectedTopic) {
      loadPosts(selectedTopic.id);
      incrementViewCount(selectedTopic.id);
    }
  }, [selectedTopic]);

  const loadTopics = async () => {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des topics');
    } else {
      const authorIds = Array.from(new Set((data || []).map((t: any) => t.author_id)));
      let profilesMap: Record<string, string> = {};
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('public_profiles_store')
          .select('id, username')
          .in('id', authorIds as string[]);
        profilesMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.username || '']));
      }
      const withAuthors = (data || []).map((t: any) => ({
        ...t,
        author: { username: profilesMap[t.author_id] || '' },
      }));
      setTopics(withAuthors);
    }
  };

  const checkModeratorStatus = async () => {
    if (!session?.user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .in('role', ['admin', 'moderator'])
      .single();
    
    setIsModerator(!!data);
  };

  const loadPosts = async (topicId: string) => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des posts');
    } else {
      const postIds = (data || []).map((p: any) => p.id);
      
      // Get report counts for each post
      let reportCounts: Record<string, number> = {};
      if (postIds.length > 0 && isModerator) {
        const { data: reportsData } = await supabase
          .from('forum_post_reports')
          .select('post_id, status')
          .in('post_id', postIds)
          .eq('status', 'pending');
        
        reportCounts = (reportsData || []).reduce((acc, r) => {
          acc[r.post_id] = (acc[r.post_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      }
      
      const authorIds = Array.from(new Set((data || []).map((p: any) => p.author_id)));
      let profilesMap: Record<string, string> = {};
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('public_profiles_store')
          .select('id, username')
          .in('id', authorIds as string[]);
        profilesMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.username || '']));
      }
      const withAuthors = (data || []).map((p: any) => ({
        ...p,
        author: { username: profilesMap[p.author_id] || '' },
        report_count: reportCounts[p.id] || 0,
      }));
      setPosts(withAuthors);
    }
  };

  const loadReports = async () => {
    const { data, error } = await supabase
      .from('forum_post_reports')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reports:', error);
      return;
    }

    const postIds = Array.from(new Set((data || []).map(r => r.post_id)));
    const reporterIds = Array.from(new Set((data || []).map(r => r.reporter_id)));

    let postsMap: Record<string, any> = {};
    let profilesMap: Record<string, string> = {};

    if (postIds.length > 0) {
      const { data: postsData } = await supabase
        .from('forum_posts')
        .select('*')
        .in('id', postIds);
      postsMap = Object.fromEntries((postsData || []).map(p => [p.id, p]));
    }

    if (reporterIds.length > 0) {
      const { data: profiles } = await supabase
        .from('public_profiles_store')
        .select('id, username')
        .in('id', reporterIds);
      profilesMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.username || '']));
    }

    const enrichedReports = (data || []).map(r => ({
      ...r,
      status: r.status as 'pending' | 'reviewed' | 'dismissed',
      post: postsMap[r.post_id],
      reporter: { username: profilesMap[r.reporter_id] || '' },
    }));

    setReports(enrichedReports);
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
    if (!session?.user) {
      toast.error('Vous devez être connecté');
      return;
    }

    // Validate input client-side first (UX only)
    const validation = topicSchema.safeParse({
      title: newTopicTitle,
      description: newTopicDescription,
    });

    if (!validation.success) {
      const error = validation.error.errors[0];
      toast.error(error.message);
      return;
    }

    try {
      // Call server-side edge function with rate limiting enforcement
      const { data, error } = await supabase.functions.invoke('create-forum-topic', {
        body: {
          title: validation.data.title,
          description: validation.data.description,
        },
      });

      if (error) {
        // Check if it's a rate limit error
        if (error.message?.includes('429')) {
          toast.error('Limite atteinte : 10 sujets maximum par jour');
        } else {
          toast.error(error.message || 'Erreur lors de la création du topic');
        }
        return;
      }

      toast.success('Topic créé avec succès');
      setNewTopicTitle('');
      setNewTopicDescription('');
      setIsCreateDialogOpen(false);
      loadTopics();
    } catch (err) {
      console.error('Error creating topic:', err);
      toast.error('Erreur lors de la création du topic');
    }
  };

  const createPost = async () => {
    if (!session?.user || !selectedTopic) {
      toast.error('Vous devez être connecté');
      return;
    }

    // Validate input client-side first (UX only)
    const validation = postSchema.safeParse({
      content: newPostContent,
    });

    if (!validation.success) {
      const error = validation.error.errors[0];
      toast.error(error.message);
      return;
    }

    try {
      // Call server-side edge function with rate limiting enforcement
      const { data, error } = await supabase.functions.invoke('create-forum-post', {
        body: {
          topicId: selectedTopic.id,
          content: validation.data.content,
        },
      });

      if (error) {
        // Check if it's a rate limit error
        if (error.message?.includes('429')) {
          toast.error('Limite atteinte : 50 messages maximum par jour');
        } else {
          toast.error(error.message || 'Erreur lors de l\'envoi du message');
        }
        return;
      }

      setNewPostContent('');
      loadPosts(selectedTopic.id);
      loadTopics(); // Refresh to update post count
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const reportPost = async () => {
    if (!session?.user || !reportPostId) return;

    // Check rate limit: 20 reports per day
    const { allowed } = await checkRateLimit(session.user.id, {
      action: 'forum_report',
      limit: 20,
      windowMinutes: 1440
    });

    if (!allowed) {
      toast.error('Limite atteinte : 20 signalements maximum par jour');
      return;
    }

    const validation = reportSchema.safeParse({ reason: reportReason });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    const { error } = await supabase
      .from('forum_post_reports')
      .insert({
        post_id: reportPostId,
        reporter_id: session.user.id,
        reason: validation.data.reason,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Vous avez déjà signalé ce message');
      } else {
        toast.error('Erreur lors du signalement');
      }
    } else {
      toast.success('Message signalé avec succès');
      setReportPostId(null);
      setReportReason('');
      if (selectedTopic) {
        loadPosts(selectedTopic.id);
      }
      loadReports();
    }
  };

  const hidePost = async () => {
    if (!hidePostId || !isModerator) return;

    const { error } = await supabase
      .from('forum_posts')
      .update({
        is_hidden: true,
        hidden_reason: hideReason,
        hidden_at: new Date().toISOString(),
        hidden_by: session?.user?.id,
      })
      .eq('id', hidePostId);

    if (error) {
      toast.error('Erreur lors du masquage');
    } else {
      toast.success('Message masqué');
      setHidePostId(null);
      setHideReason('');
      if (selectedTopic) {
        loadPosts(selectedTopic.id);
      }
      loadReports();
    }
  };

  const unhidePost = async (postId: string) => {
    if (!isModerator) return;

    const { error } = await supabase
      .from('forum_posts')
      .update({
        is_hidden: false,
        hidden_reason: null,
        hidden_at: null,
        hidden_by: null,
      })
      .eq('id', postId);

    if (error) {
      toast.error('Erreur lors du démasquage');
    } else {
      toast.success('Message rétabli');
      if (selectedTopic) {
        loadPosts(selectedTopic.id);
      }
    }
  };

  const dismissReport = async (reportId: string) => {
    if (!isModerator) return;

    const { error } = await supabase
      .from('forum_post_reports')
      .update({
        status: 'dismissed',
        reviewed_by: session?.user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (error) {
      toast.error('Erreur');
    } else {
      toast.success('Signalement rejeté');
      loadReports();
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!session?.user) {
      toast.error('Vous devez être connecté');
      return;
    }

    const { error } = await supabase
      .from('forum_topics')
      .delete()
      .eq('id', topicId)
      .eq('author_id', session.user.id);

    if (error) {
      toast.error('Erreur lors de la suppression du topic');
    } else {
      toast.success('Topic supprimé avec succès');
      setDeleteTopicId(null);
      loadTopics();
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
            <Card key={post.id} className={post.is_hidden ? 'opacity-60 border-destructive' : ''}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="mt-1">
                    <AvatarFallback>{post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{post.author?.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr })}
                      </span>
                      {post.is_hidden && (
                        <Badge variant="destructive" className="text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Masqué
                        </Badge>
                      )}
                      {isModerator && post.report_count && post.report_count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Flag className="w-3 h-3 mr-1" />
                          {post.report_count} signalement{post.report_count > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{post.content}</p>
                    {post.is_hidden && post.hidden_reason && isModerator && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Raison: {post.hidden_reason}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {session?.user && post.author_id !== session.user.id && !post.is_hidden && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReportPostId(post.id)}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          Signaler
                        </Button>
                      )}
                      {isModerator && !post.is_hidden && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHidePostId(post.id)}
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Masquer
                        </Button>
                      )}
                      {isModerator && post.is_hidden && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => unhidePost(post.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Rétablir
                        </Button>
                      )}
                    </div>
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
    <>
      <Tabs defaultValue="forum" className="w-full">
        {isModerator && (
          <div className="border-b border-border bg-card">
            <div className="container mx-auto px-4">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                <TabsTrigger value="forum" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                  <MessageSquare className="w-4 h-4" />
                  Forum
                </TabsTrigger>
                <TabsTrigger value="moderation" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                  <Shield className="w-4 h-4" />
                  Modération
                  {reports.length > 0 && (
                    <Badge variant="destructive" className="ml-1">{reports.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        )}

        <TabsContent value="forum" className="mt-0">
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
                        <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground ml-4">
                          <div className="flex flex-col items-end gap-1">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {topic.views_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {topic.posts_count}
                            </span>
                          </div>
                          {session?.user?.id === topic.author_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTopicId(topic.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {isModerator && (
          <TabsContent value="moderation" className="mt-0">
            <div className="container mx-auto p-4 max-w-4xl space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Modération - Signalements
              </h2>
              
              {reports.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Aucun signalement en attente
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm font-medium">
                              Signalé par {report.reporter?.username}
                            </CardTitle>
                            <CardDescription>
                              {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: fr })}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">En attente</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold mb-1">Raison du signalement:</p>
                          <p className="text-sm text-muted-foreground">{report.reason}</p>
                        </div>
                        {report.post && (
                          <div className="border-l-2 border-primary pl-3">
                            <p className="text-sm font-semibold mb-1">Message signalé:</p>
                            <p className="text-sm">{report.post.content}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setHidePostId(report.post_id);
                              setHideReason(report.reason);
                            }}
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Masquer le message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dismissReport(report.id)}
                          >
                            Rejeter le signalement
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Report Dialog */}
      <Dialog open={!!reportPostId} onOpenChange={(open) => !open && setReportPostId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler ce message</DialogTitle>
            <DialogDescription>
              Expliquez pourquoi ce message est inapproprié
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Raison du signalement (minimum 10 caractères)..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={reportPost} className="flex-1">
                Envoyer le signalement
              </Button>
              <Button variant="outline" onClick={() => setReportPostId(null)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hide Post Dialog */}
      <AlertDialog open={!!hidePostId} onOpenChange={(open) => !open && setHidePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Masquer ce message</AlertDialogTitle>
            <AlertDialogDescription>
              Ce message sera masqué pour tous les utilisateurs sauf les modérateurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Raison du masquage..."
            value={hideReason}
            onChange={(e) => setHideReason(e.target.value)}
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHidePostId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={hidePost}>Masquer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Topic Confirmation Dialog */}
      <AlertDialog open={!!deleteTopicId} onOpenChange={(open) => !open && setDeleteTopicId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce topic ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le topic et toutes ses réponses seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTopicId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteTopicId && deleteTopic(deleteTopicId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ForumTab;
