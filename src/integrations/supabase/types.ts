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
      app_config: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          base_xp: number
          created_at: string
          distance_km: number
          id: string
          location_id: string
          multiplier: number
          normalized_xp: number
          photo_url: string | null
          raw_xp: number
          user_id: string
          validation_status: string
        }
        Insert: {
          base_xp: number
          created_at?: string
          distance_km: number
          id?: string
          location_id: string
          multiplier: number
          normalized_xp: number
          photo_url?: string | null
          raw_xp: number
          user_id: string
          validation_status?: string
        }
        Update: {
          base_xp?: number
          created_at?: string
          distance_km?: number
          id?: string
          location_id?: string
          multiplier?: number
          normalized_xp?: number
          photo_url?: string | null
          raw_xp?: number
          user_id?: string
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      coefficient_snapshots: {
        Row: {
          coefficients: Json
          created_at: string
          created_by: string | null
          id: string
          is_draft: boolean
          period_start: string
          period_type: string
        }
        Insert: {
          coefficients: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_draft?: boolean
          period_start: string
          period_type: string
        }
        Update: {
          coefficients?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_draft?: boolean
          period_start?: string
          period_type?: string
        }
        Relationships: []
      }
      default_avatars: {
        Row: {
          avatar_url: string
          category: string
          created_at: string
          cross_visible: boolean
          display_order: number
          id: string
          is_active: boolean
          is_exclusive: boolean
          level_required: number | null
          name: string
          rarity: string
          required_badge_types: string[] | null
          track_scope: string
          unlock_description: string | null
        }
        Insert: {
          avatar_url: string
          category?: string
          created_at?: string
          cross_visible?: boolean
          display_order?: number
          id?: string
          is_active?: boolean
          is_exclusive?: boolean
          level_required?: number | null
          name: string
          rarity?: string
          required_badge_types?: string[] | null
          track_scope?: string
          unlock_description?: string | null
        }
        Update: {
          avatar_url?: string
          category?: string
          created_at?: string
          cross_visible?: boolean
          display_order?: number
          id?: string
          is_active?: boolean
          is_exclusive?: boolean
          level_required?: number | null
          name?: string
          rarity?: string
          required_badge_types?: string[] | null
          track_scope?: string
          unlock_description?: string | null
        }
        Relationships: []
      }
      denomination_change_history: {
        Row: {
          created_at: string
          from_denomination_id: string | null
          id: string
          reason_category: string | null
          reason_text: string | null
          reset_progress: boolean
          to_denomination_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          from_denomination_id?: string | null
          id?: string
          reason_category?: string | null
          reason_text?: string | null
          reset_progress?: boolean
          to_denomination_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          from_denomination_id?: string | null
          id?: string
          reason_category?: string | null
          reason_text?: string | null
          reset_progress?: boolean
          to_denomination_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "denomination_change_history_from_denomination_id_fkey"
            columns: ["from_denomination_id"]
            isOneToOne: false
            referencedRelation: "denominations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "denomination_change_history_to_denomination_id_fkey"
            columns: ["to_denomination_id"]
            isOneToOne: false
            referencedRelation: "denominations"
            referencedColumns: ["id"]
          },
        ]
      }
      denominations: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description_en: string | null
          description_fr: string | null
          display_order: number
          id: string
          label_en: string
          label_fr: string
          parent_id: string | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          id?: string
          label_en: string
          label_fr: string
          parent_id?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          id?: string
          label_en?: string
          label_fr?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "denominations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "denominations"
            referencedColumns: ["id"]
          },
        ]
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
          image_urls: string[] | null
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
          image_urls?: string[] | null
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
          image_urls?: string[] | null
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
          cross_visible: boolean
          description: string | null
          id: string
          image_urls: string[] | null
          is_community: boolean
          posts_count: number
          religion: string | null
          title: string
          track_scope: string
          updated_at: string
          views_count: number
          visibility: string
        }
        Insert: {
          author_id: string
          created_at?: string
          cross_visible?: boolean
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_community?: boolean
          posts_count?: number
          religion?: string | null
          title: string
          track_scope?: string
          updated_at?: string
          views_count?: number
          visibility?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          cross_visible?: boolean
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_community?: boolean
          posts_count?: number
          religion?: string | null
          title?: string
          track_scope?: string
          updated_at?: string
          views_count?: number
          visibility?: string
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
      hotels: {
        Row: {
          address: string
          amenities: string[] | null
          city: string
          coordinates: Json
          country: string
          created_at: string
          created_by: string | null
          description: string | null
          hotel_type: string[] | null
          id: string
          name: string
          phone: string | null
          price_range: string | null
          star_rating: number | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          coordinates?: Json
          country: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          hotel_type?: string[] | null
          id?: string
          name: string
          phone?: string | null
          price_range?: string | null
          star_rating?: number | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          coordinates?: Json
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          hotel_type?: string[] | null
          id?: string
          name?: string
          phone?: string | null
          price_range?: string | null
          star_rating?: number | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
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
          cross_visible: boolean
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
          track_scope: string
        }
        Insert: {
          created_at?: string
          cross_visible?: boolean
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
          track_scope?: string
        }
        Update: {
          created_at?: string
          cross_visible?: boolean
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
          track_scope?: string
        }
        Relationships: []
      }
      location_history: {
        Row: {
          accuracy: number | null
          activity_type: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          speed: number | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          activity_type?: string | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          speed?: number | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          activity_type?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          speed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          base_xp: number
          check_in_count_total: number
          created_at: string
          cross_visible: boolean
          denomination_scope: string
          geom: unknown
          id: string
          metadata: Json
          name: string
          type: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          base_xp?: number
          check_in_count_total?: number
          created_at?: string
          cross_visible?: boolean
          denomination_scope?: string
          geom: unknown
          id?: string
          metadata?: Json
          name: string
          type: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          base_xp?: number
          check_in_count_total?: number
          created_at?: string
          cross_visible?: boolean
          denomination_scope?: string
          geom?: unknown
          id?: string
          metadata?: Json
          name?: string
          type?: string
          updated_at?: string
          verified?: boolean
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
          cross_visible: boolean
          data_source: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          place_category: string | null
          points_value: number
          religion: string | null
          source_urls: string[] | null
          tags: string[] | null
          track_scope: string
          traditions_related: string[] | null
          type: string
          updated_at: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          city: string
          coordinates: Json
          country: string
          created_at?: string
          cross_visible?: boolean
          data_source?: string | null
          description?: string | null
          id: string
          image_url?: string | null
          name: string
          place_category?: string | null
          points_value?: number
          religion?: string | null
          source_urls?: string[] | null
          tags?: string[] | null
          track_scope?: string
          traditions_related?: string[] | null
          type: string
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          city?: string
          coordinates?: Json
          country?: string
          created_at?: string
          cross_visible?: boolean
          data_source?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          place_category?: string | null
          points_value?: number
          religion?: string | null
          source_urls?: string[] | null
          tags?: string[] | null
          track_scope?: string
          traditions_related?: string[] | null
          type?: string
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          consents: Json
          created_at: string
          denomination_change_count: number
          denomination_id: string | null
          denomination_locked_until: string | null
          home_location: unknown
          home_location_set_at: string | null
          id: string
          is_public: boolean
          onboarded_at: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          consents?: Json
          created_at?: string
          denomination_change_count?: number
          denomination_id?: string | null
          denomination_locked_until?: string | null
          home_location?: unknown
          home_location_set_at?: string | null
          id: string
          is_public?: boolean
          onboarded_at?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          consents?: Json
          created_at?: string
          denomination_change_count?: number
          denomination_id?: string | null
          denomination_locked_until?: string | null
          home_location?: unknown
          home_location_set_at?: string | null
          id?: string
          is_public?: boolean
          onboarded_at?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_denomination_id_fkey"
            columns: ["denomination_id"]
            isOneToOne: false
            referencedRelation: "denominations"
            referencedColumns: ["id"]
          },
        ]
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
          coordinates: Json | null
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
          coordinates?: Json | null
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
          coordinates?: Json | null
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
      security_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          endpoint: string | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          status_code: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          endpoint?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity: string
          status_code?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          endpoint?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          status_code?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
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
      transport_stops: {
        Row: {
          accessibility: boolean | null
          city: string
          connections: string[] | null
          coordinates: Json
          country: string
          created_at: string
          description: string | null
          id: string
          line_name: string | null
          name: string
          operator: string | null
          transport_type: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          accessibility?: boolean | null
          city: string
          connections?: string[] | null
          coordinates?: Json
          country: string
          created_at?: string
          description?: string | null
          id?: string
          line_name?: string | null
          name: string
          operator?: string | null
          transport_type: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          accessibility?: boolean | null
          city?: string
          connections?: string[] | null
          coordinates?: Json
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          line_name?: string | null
          name?: string
          operator?: string | null
          transport_type?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_type: string
          cross_visible: boolean
          id: string
          place_id: string | null
          quest_description: string | null
          quest_icon: string | null
          quest_name: string | null
          religion: string | null
          tier: string | null
          track_scope: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_type: string
          cross_visible?: boolean
          id?: string
          place_id?: string | null
          quest_description?: string | null
          quest_icon?: string | null
          quest_name?: string | null
          religion?: string | null
          tier?: string | null
          track_scope?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          badge_type?: string
          cross_visible?: boolean
          id?: string
          place_id?: string | null
          quest_description?: string | null
          quest_icon?: string | null
          quest_name?: string | null
          religion?: string | null
          tier?: string | null
          track_scope?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          ban_duration_hours: number | null
          ban_reason: string
          banned_at: string
          banned_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          strike_count: number
          unban_reason: string | null
          unbanned_at: string | null
          unbanned_by: string | null
          user_id: string
        }
        Insert: {
          ban_duration_hours?: number | null
          ban_reason: string
          banned_at?: string
          banned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          strike_count?: number
          unban_reason?: string | null
          unbanned_at?: string | null
          unbanned_by?: string | null
          user_id: string
        }
        Update: {
          ban_duration_hours?: number | null
          ban_reason?: string
          banned_at?: string
          banned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          strike_count?: number
          unban_reason?: string | null
          unbanned_at?: string | null
          unbanned_by?: string | null
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
          country_of_origin: string | null
          created_at: string
          current_streak: number
          denomination: string | null
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
          country_of_origin?: string | null
          created_at?: string
          current_streak?: number
          denomination?: string | null
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
          country_of_origin?: string | null
          created_at?: string
          current_streak?: number
          denomination?: string | null
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
      user_storage_quotas: {
        Row: {
          created_at: string
          quota_bytes: number
          updated_at: string
          used_bytes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          quota_bytes?: number
          updated_at?: string
          used_bytes?: number
          user_id: string
        }
        Update: {
          created_at?: string
          quota_bytes?: number
          updated_at?: string
          used_bytes?: number
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
      user_track_moderators: {
        Row: {
          granted_at: string
          granted_by: string | null
          track: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          track: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          track?: string
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
      check_ins_public: {
        Row: {
          created_at: string | null
          location_id: string | null
          normalized_xp: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          location_id?: string | null
          normalized_xp?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          location_id?: string | null
          normalized_xp?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
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
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      change_denomination: {
        Args: {
          p_reason_category: string
          p_reason_text: string
          p_reset_progress: boolean
          p_to_code: string
        }
        Returns: Json
      }
      check_and_ban_user: { Args: { p_user_id: string }; Returns: undefined }
      check_leaderboard_positions: { Args: never; Returns: undefined }
      cleanup_old_location_history: { Args: never; Returns: undefined }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      erase_my_location_history: { Args: never; Returns: Json }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_country_leaderboard: {
        Args: never
        Returns: {
          country_code: string
          total_points: number
          user_count: number
        }[]
      }
      get_security_logs_by_day: {
        Args: { days?: number }
        Returns: {
          critical: number
          date: string
          error: number
          info: number
          warning: number
        }[]
      }
      get_storage_usage_percentage: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_denomination: { Args: { _user_id: string }; Returns: string }
      get_user_payment_info: {
        Args: { _user_id: string }
        Returns: {
          stripe_customer_id: string
          subscription_end: string
          subscription_tier: string
        }[]
      }
      get_user_religion: { Args: { _user_id: string }; Returns: string }
      gettransactionid: { Args: never; Returns: unknown }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_user_storage_quota: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          quota_bytes: number
          updated_at: string
          used_bytes: number
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_storage_quotas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_admin: { Args: never; Returns: boolean }
      is_friend_of: {
        Args: { _author_id: string; _user_id: string }
        Returns: boolean
      }
      is_track_moderator: {
        Args: { _track: string; _user_id: string }
        Returns: boolean
      }
      is_user_banned: { Args: { p_user_id: string }; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_expired_bans: { Args: never; Returns: number }
      set_active_avatar: { Args: { p_avatar_id: string }; Returns: undefined }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlock_level_rewards: {
        Args: { p_new_level: number; p_user_id: string }
        Returns: {
          created_at: string
          cross_visible: boolean
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
          track_scope: string
        }[]
        SetofOptions: {
          from: "*"
          to: "level_rewards"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
