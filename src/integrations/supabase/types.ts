export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin: {
        Row: {
          admin_level: string
          created_at: string | null
          id: string
          location_id: string | null
          permissions: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_level: string
          created_at?: string | null
          id?: string
          location_id?: string | null
          permissions?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_level?: string
          created_at?: string | null
          id?: string
          location_id?: string | null
          permissions?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action_type: string
          actor_type: string
          created_at: string | null
          description: string
          id: string
          ip_address: string | null
          metadata: Json | null
          performed_by: string | null
          target_id: string
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action_type: string
          actor_type: string
          created_at?: string | null
          description: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          performed_by?: string | null
          target_id: string
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          actor_type?: string
          created_at?: string | null
          description?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          performed_by?: string | null
          target_id?: string
          target_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_audit_performed_by"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          check_in_time: string | null
          check_out_time: string | null
          checked_in: boolean | null
          created_at: string | null
          email: string
          end_time: string
          full_name: string
          id: string
          location: string | null
          no_show: boolean | null
          notes: string | null
          overbooked: boolean | null
          phone: string | null
          purpose: string | null
          role: string
          source: string | null
          space_id: string
          space_type: string | null
          start_time: string
          status: string
          updated_at: string | null
          user_id: string
          was_rescheduled: boolean | null
        }
        Insert: {
          booking_date: string
          check_in_time?: string | null
          check_out_time?: string | null
          checked_in?: boolean | null
          created_at?: string | null
          email: string
          end_time: string
          full_name: string
          id?: string
          location?: string | null
          no_show?: boolean | null
          notes?: string | null
          overbooked?: boolean | null
          phone?: string | null
          purpose?: string | null
          role?: string
          source?: string | null
          space_id: string
          space_type?: string | null
          start_time: string
          status: string
          updated_at?: string | null
          user_id: string
          was_rescheduled?: boolean | null
        }
        Update: {
          booking_date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          checked_in?: boolean | null
          created_at?: string | null
          email?: string
          end_time?: string
          full_name?: string
          id?: string
          location?: string | null
          no_show?: boolean | null
          notes?: string | null
          overbooked?: boolean | null
          phone?: string | null
          purpose?: string | null
          role?: string
          source?: string | null
          space_id?: string
          space_type?: string | null
          start_time?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          was_rescheduled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_actions: {
        Row: {
          action_type: string
          chat_log_id: string | null
          created_at: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          platform: string
          status: string
          target_id: string
          target_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          chat_log_id?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          platform: string
          status: string
          target_id: string
          target_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          chat_log_id?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string
          status?: string
          target_id?: string
          target_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bot_actions_chat"
            columns: ["chat_log_id"]
            isOneToOne: false
            referencedRelation: "chat_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bot_actions_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_logs: {
        Row: {
          created_at: string | null
          entities: Json | null
          id: string
          intent: string | null
          message: string
          message_type: string
          platform: string
          resolved: boolean | null
          response_time_ms: number | null
          sender: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entities?: Json | null
          id?: string
          intent?: string | null
          message: string
          message_type: string
          platform: string
          resolved?: boolean | null
          response_time_ms?: number | null
          sender: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entities?: Json | null
          id?: string
          intent?: string | null
          message?: string
          message_type?: string
          platform?: string
          resolved?: boolean | null
          response_time_ms?: number | null
          sender?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_chat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_logs: {
        Row: {
          booking_id: string | null
          category: string
          comment: string | null
          created_at: string | null
          focus_event_id: string | null
          id: string
          is_public_testimonial: boolean | null
          rating: number | null
          resolution_note: string | null
          resolved: boolean | null
          resolved_by: string | null
          source: string | null
          space_id: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          category: string
          comment?: string | null
          created_at?: string | null
          focus_event_id?: string | null
          id?: string
          is_public_testimonial?: boolean | null
          rating?: number | null
          resolution_note?: string | null
          resolved?: boolean | null
          resolved_by?: string | null
          source?: string | null
          space_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          category?: string
          comment?: string | null
          created_at?: string | null
          focus_event_id?: string | null
          id?: string
          is_public_testimonial?: boolean | null
          rating?: number | null
          resolution_note?: string | null
          resolved?: boolean | null
          resolved_by?: string | null
          source?: string | null
          space_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_feedback_admin"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_focus"
            columns: ["focus_event_id"]
            isOneToOne: false
            referencedRelation: "focus_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_events: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          end_time: string
          focus_level: number | null
          id: string
          interrupted: boolean | null
          interruption_reason: string | null
          notes: string | null
          source: string
          space_id: string | null
          start_time: string
          tag: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          end_time: string
          focus_level?: number | null
          id?: string
          interrupted?: boolean | null
          interruption_reason?: string | null
          notes?: string | null
          source: string
          space_id?: string | null
          start_time: string
          tag?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string
          focus_level?: number | null
          id?: string
          interrupted?: boolean | null
          interruption_reason?: string | null
          notes?: string | null
          source?: string
          space_id?: string | null
          start_time?: string
          tag?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_focus_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_focus_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string
          contact_email: string | null
          contact_phone: string | null
          country: string
          created_at: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          state: string | null
          timezone: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          state?: string | null
          timezone: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_logs: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          is_emergency: boolean | null
          notes: string | null
          reason: string
          scheduled_by: string
          space_id: string
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_emergency?: boolean | null
          notes?: string | null
          reason: string
          scheduled_by: string
          space_id: string
          start_time: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_emergency?: boolean | null
          notes?: string | null
          reason?: string
          scheduled_by?: string
          space_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_maintenance_scheduled_by"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_maintenance_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      no_show_logs: {
        Row: {
          auto_flagged: boolean | null
          booking_id: string
          created_at: string | null
          detected_at: string
          id: string
          notes: string | null
          notified_user: boolean | null
          penalty_applied: boolean | null
          reason_provided: string | null
          resolved: boolean | null
          scheduled_end: string
          scheduled_start: string
          space_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_flagged?: boolean | null
          booking_id: string
          created_at?: string | null
          detected_at: string
          id?: string
          notes?: string | null
          notified_user?: boolean | null
          penalty_applied?: boolean | null
          reason_provided?: string | null
          resolved?: boolean | null
          scheduled_end: string
          scheduled_start: string
          space_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_flagged?: boolean | null
          booking_id?: string
          created_at?: string | null
          detected_at?: string
          id?: string
          notes?: string | null
          notified_user?: boolean | null
          penalty_applied?: boolean | null
          reason_provided?: string | null
          resolved?: boolean | null
          scheduled_end?: string
          scheduled_start?: string
          space_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_noshow_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_noshow_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_noshow_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string
          created_at: string | null
          created_by: string
          id: string
          message: string
          metadata: Json | null
          read_at: string | null
          related_id: string | null
          related_type: string | null
          sent_at: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          created_by: string
          id?: string
          message: string
          metadata?: Json | null
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          sent_at?: string | null
          status: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          created_by?: string
          id?: string
          message?: string
          metadata?: Json | null
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notification_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      overstay_logs: {
        Row: {
          actual_check_out: string
          booking_id: string
          created_at: string | null
          detected_at: string
          id: string
          next_booking_id: string | null
          notes: string | null
          notified_admin: boolean | null
          notified_user: boolean | null
          overstay_minutes: number
          penalty_applied: boolean | null
          resolved: boolean | null
          scheduled_end: string
          space_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_check_out: string
          booking_id: string
          created_at?: string | null
          detected_at: string
          id?: string
          next_booking_id?: string | null
          notes?: string | null
          notified_admin?: boolean | null
          notified_user?: boolean | null
          overstay_minutes: number
          penalty_applied?: boolean | null
          resolved?: boolean | null
          scheduled_end: string
          space_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_check_out?: string
          booking_id?: string
          created_at?: string | null
          detected_at?: string
          id?: string
          next_booking_id?: string | null
          notes?: string | null
          notified_admin?: boolean | null
          notified_user?: boolean | null
          overstay_minutes?: number
          penalty_applied?: boolean | null
          resolved?: boolean | null
          scheduled_end?: string
          space_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_overstay_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_overstay_next_booking"
            columns: ["next_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_overstay_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_overstay_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          id: string
          is_allowed: boolean
          resource: string
          role: string
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          is_allowed?: boolean
          resource: string
          role: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          is_allowed?: boolean
          resource?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reschedule_logs: {
        Row: {
          auto_confirmed: boolean | null
          booking_id: string
          created_at: string | null
          id: string
          initiated_by: string
          new_end_time: string
          new_start_time: string
          notes: string | null
          old_end_time: string
          old_start_time: string
          reason: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_confirmed?: boolean | null
          booking_id: string
          created_at?: string | null
          id?: string
          initiated_by: string
          new_end_time: string
          new_start_time: string
          notes?: string | null
          old_end_time: string
          old_start_time: string
          reason: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_confirmed?: boolean | null
          booking_id?: string
          created_at?: string | null
          id?: string
          initiated_by?: string
          new_end_time?: string
          new_start_time?: string
          notes?: string | null
          old_end_time?: string
          old_start_time?: string
          reason?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reschedule_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reschedule_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          availability: Json | null
          capacity: number
          created_at: string | null
          equipment: string[] | null
          features: string[] | null
          id: string
          is_bookable: boolean | null
          is_private: boolean | null
          last_used_at: string | null
          location: string
          name: string
          places: string | null
          space_type: string
          status: string
          updated_at: string | null
          usage_score: number | null
        }
        Insert: {
          availability?: Json | null
          capacity: number
          created_at?: string | null
          equipment?: string[] | null
          features?: string[] | null
          id?: string
          is_bookable?: boolean | null
          is_private?: boolean | null
          last_used_at?: string | null
          location: string
          name: string
          places?: string | null
          space_type: string
          status?: string
          updated_at?: string | null
          usage_score?: number | null
        }
        Update: {
          availability?: Json | null
          capacity?: number
          created_at?: string | null
          equipment?: string[] | null
          features?: string[] | null
          id?: string
          is_bookable?: boolean | null
          is_private?: boolean | null
          last_used_at?: string | null
          location?: string
          name?: string
          places?: string | null
          space_type?: string
          status?: string
          updated_at?: string | null
          usage_score?: number | null
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string | null
          delivered_via: string | null
          id: string
          message: string
          origin: string
          related_booking_id: string | null
          space_id: string | null
          status: string
          suggested_time: string | null
          suggestion_type: string
          updated_at: string | null
          user_id: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_via?: string | null
          id?: string
          message: string
          origin: string
          related_booking_id?: string | null
          space_id?: string | null
          status?: string
          suggested_time?: string | null
          suggestion_type: string
          updated_at?: string | null
          user_id: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_via?: string | null
          id?: string
          message?: string
          origin?: string
          related_booking_id?: string | null
          space_id?: string | null
          status?: string
          suggested_time?: string | null
          suggestion_type?: string
          updated_at?: string | null
          user_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_suggestion_booking"
            columns: ["related_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_suggestion_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_suggestion_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_updated_by_admin"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          ai_persona_enabled: boolean | null
          created_at: string | null
          id: string
          notification_opt_in: boolean | null
          preferred_hours: Json | null
          preferred_space_type: string | null
          updated_at: string | null
          user_id: string
          work_style: string | null
        }
        Insert: {
          ai_persona_enabled?: boolean | null
          created_at?: string | null
          id?: string
          notification_opt_in?: boolean | null
          preferred_hours?: Json | null
          preferred_space_type?: string | null
          updated_at?: string | null
          user_id: string
          work_style?: string | null
        }
        Update: {
          ai_persona_enabled?: boolean | null
          created_at?: string | null
          id?: string
          notification_opt_in?: boolean | null
          preferred_hours?: Json | null
          preferred_space_type?: string | null
          updated_at?: string | null
          user_id?: string
          work_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_provider: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          joined_at: string | null
          last_login: string | null
          location_id: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          auth_provider?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          joined_at?: string | null
          last_login?: string | null
          location_id?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          auth_provider?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_login?: string | null
          location_id?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      utilization_logs: {
        Row: {
          activity_type: string | null
          auto_logged: boolean | null
          booking_id: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          day_of_week: string | null
          duration_minutes: number | null
          feedback_score: number | null
          hour_of_day: number | null
          id: string
          no_show: boolean | null
          notes: string | null
          overstayed: boolean | null
          source: string | null
          space_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_type?: string | null
          auto_logged?: boolean | null
          booking_id?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          day_of_week?: string | null
          duration_minutes?: number | null
          feedback_score?: number | null
          hour_of_day?: number | null
          id?: string
          no_show?: boolean | null
          notes?: string | null
          overstayed?: boolean | null
          source?: string | null
          space_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string | null
          auto_logged?: boolean | null
          booking_id?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          day_of_week?: string | null
          duration_minutes?: number | null
          feedback_score?: number | null
          hour_of_day?: number | null
          id?: string
          no_show?: boolean | null
          notes?: string | null
          overstayed?: boolean | null
          source?: string | null
          space_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
