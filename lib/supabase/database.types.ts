export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type VerificationLevel =
  | "none"
  | "phone"
  | "id_pending"
  | "verified";

export type ListingStatus =
  | "draft"
  | "active"
  | "reserved"
  | "sold"
  | "archived";

export type ListingVerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export type CurrencyCode = "USD" | "CDF";

export type SellerVerificationStatus =
  | "pending"
  | "approved"
  | "rejected";

export type ReportStatus =
  | "open"
  | "reviewed"
  | "actioned"
  | "dismissed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          verification_level: VerificationLevel;
          is_seller: boolean;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          verification_level?: VerificationLevel;
          is_seller?: boolean;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          verification_level?: VerificationLevel;
          is_seller?: boolean;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seller_verifications: {
        Row: {
          id: string;
          user_id: string;
          id_document_path: string | null;
          selfie_path: string | null;
          status: SellerVerificationStatus;
          reviewer_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          id_document_path?: string | null;
          selfie_path?: string | null;
          status?: SellerVerificationStatus;
          reviewer_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          id_document_path?: string | null;
          selfie_path?: string | null;
          status?: SellerVerificationStatus;
          reviewer_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name_fr: string;
          icon: string | null;
          sort_order: number;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_fr: string;
          icon?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_fr?: string;
          icon?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name_fr: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name_fr: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          name_fr?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          commune: string;
          quartier: string | null;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          commune: string;
          quartier?: string | null;
          slug: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          commune?: string;
          quartier?: string | null;
          slug?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string;
          subcategory_id: string | null;
          location_id: string | null;
          title: string;
          description: string;
          price: number;
          currency: CurrencyCode;
          negociable: boolean;
          status: ListingStatus;
          verification_status: ListingVerificationStatus;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          seller_id: string;
          category_id: string;
          subcategory_id?: string | null;
          location_id?: string | null;
          title: string;
          description?: string;
          price: number;
          currency?: CurrencyCode;
          negociable?: boolean;
          status?: ListingStatus;
          verification_status?: ListingVerificationStatus;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          seller_id?: string;
          category_id?: string;
          subcategory_id?: string | null;
          location_id?: string | null;
          title?: string;
          description?: string;
          price?: number;
          currency?: CurrencyCode;
          negociable?: boolean;
          status?: ListingStatus;
          verification_status?: ListingVerificationStatus;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Relationships: [];
      };
      listing_media: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          media_type: string;
          sort_order: number;
          is_cover: boolean;
          authenticity_flag: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          storage_path: string;
          media_type?: string;
          sort_order?: number;
          is_cover?: boolean;
          authenticity_flag?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          storage_path?: string;
          media_type?: string;
          sort_order?: number;
          is_cover?: boolean;
          authenticity_flag?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          listing_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          last_message_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          last_message_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          body?: string;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string | null;
          listing_id: string | null;
          reason: string;
          details: string | null;
          status: ReportStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id?: string | null;
          listing_id?: string | null;
          reason: string;
          details?: string | null;
          status?: ReportStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          reported_user_id?: string | null;
          listing_id?: string | null;
          reason?: string;
          details?: string | null;
          status?: ReportStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      blocks: {
        Row: {
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: {
          blocker_id: string;
          blocked_id: string;
          created_at?: string;
        };
        Update: {
          blocker_id?: string;
          blocked_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      verification_level: VerificationLevel;
      listing_status: ListingStatus;
      listing_verification_status: ListingVerificationStatus;
      currency_code: CurrencyCode;
      seller_verification_status: SellerVerificationStatus;
      report_status: ReportStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ListingMedia = Database["public"]["Tables"]["listing_media"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

export type ListingWithRelations = Listing & {
  category: Pick<Category, "slug" | "name_fr"> | null;
  location: Pick<Location, "commune" | "quartier" | "slug"> | null;
  listing_media: Pick<ListingMedia, "storage_path" | "is_cover" | "sort_order">[];
  seller: Pick<Profile, "id" | "display_name" | "verification_level"> | null;
};
