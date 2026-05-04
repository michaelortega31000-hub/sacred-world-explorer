import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const VAPID_PUBLIC_KEY = 'BDnKQA2QfHMm_M6I1p2PJQVrCTYyfjxswloaw8UZ9fsxI_AXOEoFu5cCqOJv7AxRbj_TZBy8i2EzmFQxfVj_bvc';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Helper to access pushManager with proper typing
  const getPushManager = (reg: ServiceWorkerRegistration) => {
    return (reg as unknown as { pushManager: { getSubscription: () => Promise<PushSubscription | null>; subscribe: (options: PushSubscriptionOptionsInit) => Promise<PushSubscription> } }).pushManager;
  };
  const { toast } = useToast();

  useEffect(() => {
    // Check if Service Workers and Push API are supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    // Skip SW registration in Lovable preview/dev sandboxes — a stale SW
    // can trap the iframe on the loading shell.
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const isPreviewSandbox =
      host.endsWith('.lovableproject.com') ||
      host.endsWith('.lovable.app') ||
      host === 'localhost' ||
      host === '127.0.0.1';
    setIsSupported(supported && !isPreviewSandbox);

    if (supported && !isPreviewSandbox) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      logger.log('[Push] Service Worker registered:', reg);
      setRegistration(reg);

      // Check if already subscribed
      const subscription = await getPushManager(reg).getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('[Push] Service Worker registration failed:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    if (!registration) {
      toast({
        title: 'Erreur',
        description: 'Service Worker non disponible',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          title: 'Permission refusée',
          description: 'Veuillez autoriser les notifications dans les paramètres du navigateur',
          variant: 'destructive'
        });
        return false;
      }

      // Subscribe to push notifications
      const subscription = await getPushManager(registration).subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      logger.log('[Push] Subscribed:', subscription);

      // Send subscription to backend
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const subscriptionJson = subscription.toJSON();
      
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscriptionJson.endpoint!,
          p256dh: subscriptionJson.keys!.p256dh,
          auth: subscriptionJson.keys!.auth
        }, {
          onConflict: 'user_id,endpoint'
        });

      if (error) {
        console.error('[Push] Failed to save subscription:', error);
        throw error;
      }

      setIsSubscribed(true);
      toast({
        title: 'Notifications activées',
        description: 'Vous recevrez désormais des notifications push'
      });

      return true;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de s\'abonner aux notifications',
        variant: 'destructive'
      });
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!registration) return false;

    try {
      const subscription = await getPushManager(registration).getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Remove from backend
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint);
        }

        setIsSubscribed(false);
        toast({
          title: 'Notifications désactivées',
          description: 'Vous ne recevrez plus de notifications push'
        });
        return true;
      }
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de se désabonner',
        variant: 'destructive'
      });
      return false;
    }

    return false;
  };

  const checkSubscription = async () => {
    if (!registration) return false;
    const subscription = await getPushManager(registration).getSubscription();
    const subscribed = !!subscription;
    setIsSubscribed(subscribed);
    return subscribed;
  };

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    checkSubscription
  };
};
