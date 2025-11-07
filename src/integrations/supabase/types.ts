export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_comments: {
        Row: {
          activity_id: string
          activity_type: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          activity_type: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          activity_type?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      activity_likes: {
        Row: {
          activity_id: string
          activity_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          activity_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      default_avatars: {
        Row: {
          avatar_url: string
          category: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_exclusive: boolean
          level_required: number | null
          name: string
          rarity: string
          required_badge_types: string[] | null
          unlock_description: string | null
        }
        Insert: {
          avatar_url: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_exclusive?: boolean
          level_required?: number | null
          name: string
          rarity?: string
          required_badge_types?: string[] | null
          unlock_description?: string | null
        }
        Update: {
          avatar_url?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_exclusive?: boolean
          level_required?: number | null
          name?: string
          rarity?: string
          required_badge_types?: string[] | null
          unlock_description?: string | null
        }
        Relationships: []
      }
      event_reminders: {
        Row: {
          created_at: string
          event_date: string
          event_id: string
          event_name: string
          id: string
          is_enabled: boolean
          last_sent_at: string | null
          reminder_times: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          event_id: string
          event_name: string
          id?: string
          is_enabled?: boolean
          last_sent_at?: string | null
          reminder_times?: number[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          event_id?: string
          event_name?: string
          id?: string
          is_enabled?: boolean
          last_sent_at?: string | null
          reminder_times?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_post_reports: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          hidden_at: string | null
          hidden_by: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          created_at: string
          description: string | null
          id: string
          posts_count: number
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id: string
          created_at?: string
          description?: string | null
          id?: string
          posts_count?: number
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string | null
          id?: string
          posts_count?: number
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_achievements: {
        Row: {
          achieved_at: string
          achievement_type: string
          avatar_unlocked: string | null
          id: string
          rank: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_type: string
          avatar_unlocked?: string | null
          id?: string
          rank: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_type?: string
          avatar_unlocked?: string | null
          id?: string
          rank?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_achievements_avatar_unlocked_fkey"
            columns: ["avatar_unlocked"]
            isOneToOne: false
            referencedRelation: "default_avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      level_rewards: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          level_required: number
          metadata: Json | null
          name: string
          rarity: string
          reward_id: string
          reward_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level_required: number
          metadata?: Json | null
          name: string
          rarity?: string
          reward_id: string
          reward_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level_required?: number
          metadata?: Json | null
          name?: string
          rarity?: string
          reward_id?: string
          reward_type?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_public: boolean
          media_urls: string[] | null
          memory_type: string
          place_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          media_urls?: string[] | null
          memory_type?: string
          place_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          media_urls?: string[] | null
          memory_type?: string
          place_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_history: {
        Row: {
          created_at: string
          event_date: string
          event_id: string
          event_name: string
          id: string
          notification_type: string
          opened: boolean
          opened_at: string | null
          reminder_time_minutes: number
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          event_id: string
          event_name: string
          id?: string
          notification_type: string
          opened?: boolean
          opened_at?: string | null
          reminder_time_minutes: number
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          event_id?: string
          event_name?: string
          id?: string
          notification_type?: string
          opened?: boolean
          opened_at?: string | null
          reminder_time_minutes?: number
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          city: string
          coordinates: Json
          country: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          points_value: number
          religion: string | null
          type: string
          updated_at: string
        }
        Insert: {
          city: string
          coordinates: Json
          country: string
          created_at?: string
          description?: string | null
          id: string
          image_url?: string | null
          name: string
          points_value?: number
          religion?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          city?: string
          coordinates?: Json
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          points_value?: number
          religion?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_public: boolean
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_public?: boolean
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      public_profiles_store: {
        Row: {
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_store_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "avatar_collector_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_profiles_store_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_store_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_store_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "public_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_store_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          window_start?: string
        }
        Update: {
          action?: string
          count?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          city: string
          continent: string | null
          country: string
          created_at: string
          created_by: string | null
          cuisine: string
          description: string | null
          google_place_id: string | null
          id: string
          name: string
          phone: string | null
          rating: number | null
          type: string[]
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          continent?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          cuisine: string
          description?: string | null
          google_place_id?: string | null
          id?: string
          name: string
          phone?: string | null
          rating?: number | null
          type?: string[]
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          continent?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          cuisine?: string
          description?: string | null
          google_place_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          rating?: number | null
          type?: string[]
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          price_monthly: number | null
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price_monthly?: number | null
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price_monthly?: number | null
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_type: string
          id: string
          place_id: string | null
          quest_description: string | null
          quest_icon: string | null
          quest_name: string | null
          religion: string | null
          tier: string | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_type: string
          id?: string
          place_id?: string | null
          quest_description?: string | null
          quest_icon?: string | null
          quest_name?: string | null
          religion?: string | null
          tier?: string | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          badge_type?: string
          id?: string
          place_id?: string | null
          quest_description?: string | null
          quest_icon?: string | null
          quest_name?: string | null
          religion?: string | null
          tier?: string | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_custom_avatars: {
        Row: {
          avatar_url: string
          created_at: string
          id: string
          is_active: boolean
          moderated_at: string | null
          moderation_reason: string | null
          moderation_status: string
          name: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          id?: string
          is_active?: boolean
          moderated_at?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          name?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          id?: string
          is_active?: boolean
          moderated_at?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          name?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_custom_events: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          is_recurring: boolean | null
          photo_url: string | null
          title: string
          tradition: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          is_recurring?: boolean | null
          photo_url?: string | null
          title: string
          tradition?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          is_recurring?: boolean | null
          photo_url?: string | null
          title?: string
          tradition?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_event_reminders: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          event_id: string
          filter_traditions: string[] | null
          id: string
          reminder_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          event_id: string
          filter_traditions?: string[] | null
          id?: string
          reminder_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          event_id?: string
          filter_traditions?: string[] | null
          id?: string
          reminder_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          badges: string[]
          created_at: string
          current_streak: number
          geolocation_enabled: boolean
          id: string
          language: string
          last_quest_date: string
          longest_streak: number
          planned_route_start_city: string
          saved_pois: Json | null
          saved_restaurants: string[]
          selected_religion: string | null
          show_planned_route: boolean
          total_points: number
          trip_places: string[]
          updated_at: string
          user_id: string
          visited_places: string[]
        }
        Insert: {
          badges?: string[]
          created_at?: string
          current_streak?: number
          geolocation_enabled?: boolean
          id?: string
          language?: string
          last_quest_date?: string
          longest_streak?: number
          planned_route_start_city?: string
          saved_pois?: Json | null
          saved_restaurants?: string[]
          selected_religion?: string | null
          show_planned_route?: boolean
          total_points?: number
          trip_places?: string[]
          updated_at?: string
          user_id: string
          visited_places?: string[]
        }
        Update: {
          badges?: string[]
          created_at?: string
          current_streak?: number
          geolocation_enabled?: boolean
          id?: string
          language?: string
          last_quest_date?: string
          longest_streak?: number
          planned_route_start_city?: string
          saved_pois?: Json | null
          saved_restaurants?: string[]
          selected_religion?: string | null
          show_planned_route?: boolean
          total_points?: number
          trip_places?: string[]
          updated_at?: string
          user_id?: string
          visited_places?: string[]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_unlocked_default_avatars: {
        Row: {
          avatar_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          avatar_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          avatar_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocked_default_avatars_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "default_avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocked_rewards: {
        Row: {
          created_at: string
          id: string
          is_equipped: boolean
          reward_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_equipped?: boolean
          reward_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_equipped?: boolean
          reward_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocked_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "level_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_history: {
        Row: {
          audio_played: boolean
          badge_id: string | null
          created_at: string
          gps_location: Json | null
          id: string
          offline_synced: boolean
          place_id: string
          points_earned: number
          user_id: string
          visit_timestamp: string
        }
        Insert: {
          audio_played?: boolean
          badge_id?: string | null
          created_at?: string
          gps_location?: Json | null
          id?: string
          offline_synced?: boolean
          place_id: string
          points_earned?: number
          user_id: string
          visit_timestamp?: string
        }
        Update: {
          audio_played?: boolean
          badge_id?: string | null
          created_at?: string
          gps_location?: Json | null
          id?: string
          offline_synced?: boolean
          place_id?: string
          points_earned?: number
          user_id?: string
          visit_timestamp?: string
        }
        Relationships: []
      }
      visit_photos: {
        Row: {
          ai_analysis: string | null
          ai_confidence: number | null
          created_at: string | null
          geolocation: Json | null
          id: string
          identified_elements: string[] | null
          is_public: boolean | null
          photo_url: string
          place_id: string
          user_id: string
          validated_at: string | null
        }
        Insert: {
          ai_analysis?: string | null
          ai_confidence?: number | null
          created_at?: string | null
          geolocation?: Json | null
          id?: string
          identified_elements?: string[] | null
          is_public?: boolean | null
          photo_url: string
          place_id: string
          user_id: string
          validated_at?: string | null
        }
        Update: {
          ai_analysis?: string | null
          ai_confidence?: number | null
          created_at?: string | null
          geolocation?: Json | null
          id?: string
          identified_elements?: string[] | null
          is_public?: boolean | null
          photo_url?: string
          place_id?: string
          user_id?: string
          validated_at?: string | null
        }
        Relationships: []
      }
      vr_content: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          place_id: string
          position: Json | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          place_id: string
          position?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          place_id?: string
          position?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      avatar_collector_stats: {
        Row: {
          avatar_url: string | null
          common_count: number | null
          epic_count: number | null
          last_unlock_at: string | null
          legendary_count: number | null
          rare_count: number | null
          total_unlocked: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          created_at: string | null
          id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      public_user_stats: {
        Row: {
          avatar_url: string | null
          badges_count: number | null
          created_at: string | null
          current_streak: number | null
          id: string | null
          longest_streak: number | null
          selected_religion: string | null
          total_points: number | null
          username: string | null
          visited_places_count: number | null
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          is_public: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          is_public?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          is_public?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_leaderboard_positions: { Args: never; Returns: undefined }
      get_user_payment_info: {
        Args: { _user_id: string }
        Returns: {
          stripe_customer_id: string
          subscription_end: string
          subscription_tier: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      set_active_avatar: { Args: { p_avatar_id: string }; Returns: undefined }
      unlock_level_rewards: {
        Args: { p_new_level: number; p_user_id: string }
        Returns: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          level_required: number
          metadata: Json | null
          name: string
          rarity: string
          reward_id: string
          reward_type: string
        }[]
        SetofOptions: {
          from: "*"
          to: "level_rewards"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
