
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "activities": {
                  Row: {
                    "archived_at": string | null,"created_at": string,"created_by": string | null,"emoji": string | null,"id": string,"link_href": string | null,"name": string,"show_in_home": boolean,"slug": string,"sort_order": number,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "archived_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"emoji"?: string | null,"id"?: string,"link_href"?: string | null,"name": string,"show_in_home"?: boolean,"slug": string,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "archived_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"emoji"?: string | null,"id"?: string,"link_href"?: string | null,"name"?: string,"show_in_home"?: boolean,"slug"?: string,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"admin_users": {
                  Row: {
                    "active": boolean,"created_at": string,"email": string,"full_name": string | null,"role": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"email": string,"full_name"?: string | null,"role"?: string,"user_id": string
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"email"?: string,"full_name"?: string | null,"role"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"audit_log": {
                  Row: {
                    "action": string,"changed_at": string,"changed_by": string | null,"id": number,"record_id": string,"summary": Json | null,"table_name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"changed_at"?: string,"changed_by"?: string | null,"id"?: never,"record_id": string,"summary"?: Json | null,"table_name": string
                  }
                  Update: {
                    "action"?: string,"changed_at"?: string,"changed_by"?: string | null,"id"?: never,"record_id"?: string,"summary"?: Json | null,"table_name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"branches": {
                  Row: {
                    "address": string | null,"city": string,"created_at": string,"created_by": string | null,"hours": string | null,"id": string,"is_visible": boolean,"legacy_key": string | null,"maps_url": string | null,"name": string,"notes": string | null,"offers_rental": boolean,"phones": (string)[],"region": string,"season_label": string | null,"services": (string)[],"sort_order": number,"updated_at": string,"updated_by": string | null,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"city": string,"created_at"?: string,"created_by"?: string | null,"hours"?: string | null,"id"?: string,"is_visible"?: boolean,"legacy_key"?: string | null,"maps_url"?: string | null,"name": string,"notes"?: string | null,"offers_rental"?: boolean,"phones"?: (string)[],"region": string,"season_label"?: string | null,"services"?: (string)[],"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null,"whatsapp"?: string | null
                  }
                  Update: {
                    "address"?: string | null,"city"?: string,"created_at"?: string,"created_by"?: string | null,"hours"?: string | null,"id"?: string,"is_visible"?: boolean,"legacy_key"?: string | null,"maps_url"?: string | null,"name"?: string,"notes"?: string | null,"offers_rental"?: boolean,"phones"?: (string)[],"region"?: string,"season_label"?: string | null,"services"?: (string)[],"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null,"whatsapp"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"brands": {
                  Row: {
                    "archived_at": string | null,"created_at": string,"created_by": string | null,"id": string,"logo_media_id": string | null,"name": string,"show_on_site": boolean,"slug": string,"sort_order": number,"updated_at": string,"updated_by": string | null,"website_url": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "archived_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"id"?: string,"logo_media_id"?: string | null,"name": string,"show_on_site"?: boolean,"slug": string,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null,"website_url"?: string | null
                  }
                  Update: {
                    "archived_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"id"?: string,"logo_media_id"?: string | null,"name"?: string,"show_on_site"?: boolean,"slug"?: string,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null,"website_url"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "brands_logo_media_id_fkey"
      columns: ["logo_media_id"]
isOneToOne: false
      referencedRelation: "media"
      referencedColumns: ["id"]
    }
                  ]
                },"categories": {
                  Row: {
                    "archived_at": string | null,"created_at": string,"created_by": string | null,"description": string | null,"id": string,"name": string,"slug": string,"sort_order": number,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "archived_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"description"?: string | null,"id"?: string,"name": string,"slug": string,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "archived_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"description"?: string | null,"id"?: string,"name"?: string,"slug"?: string,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"media": {
                  Row: {
                    "alt": string,"created_at": string,"created_by": string | null,"external_url": string | null,"height": number | null,"id": string,"mime_type": string | null,"original_name": string | null,"size_bytes": number | null,"storage_path": string | null,"updated_at": string,"updated_by": string | null,"width": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "alt"?: string,"created_at"?: string,"created_by"?: string | null,"external_url"?: string | null,"height"?: number | null,"id"?: string,"mime_type"?: string | null,"original_name"?: string | null,"size_bytes"?: number | null,"storage_path"?: string | null,"updated_at"?: string,"updated_by"?: string | null,"width"?: number | null
                  }
                  Update: {
                    "alt"?: string,"created_at"?: string,"created_by"?: string | null,"external_url"?: string | null,"height"?: number | null,"id"?: string,"mime_type"?: string | null,"original_name"?: string | null,"size_bytes"?: number | null,"storage_path"?: string | null,"updated_at"?: string,"updated_by"?: string | null,"width"?: number | null
                  }
                  Relationships: [
                    
                  ]
                },"posts": {
                  Row: {
                    "body_html": string,"category": Database["public"]['Enums']["post_category"],"cover_alt": string | null,"cover_media_id": string | null,"created_at": string,"created_by": string | null,"excerpt": string | null,"featured": boolean,"id": string,"legacy_key": string | null,"published_at": string | null,"reading_minutes": number,"seo_description": string | null,"seo_title": string | null,"slug": string,"status": Database["public"]['Enums']["content_status"],"title": string,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "body_html"?: string,"category": Database["public"]['Enums']["post_category"],"cover_alt"?: string | null,"cover_media_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"excerpt"?: string | null,"featured"?: boolean,"id"?: string,"legacy_key"?: string | null,"published_at"?: string | null,"reading_minutes"?: number,"seo_description"?: string | null,"seo_title"?: string | null,"slug": string,"status"?: Database["public"]['Enums']["content_status"],"title": string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "body_html"?: string,"category"?: Database["public"]['Enums']["post_category"],"cover_alt"?: string | null,"cover_media_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"excerpt"?: string | null,"featured"?: boolean,"id"?: string,"legacy_key"?: string | null,"published_at"?: string | null,"reading_minutes"?: number,"seo_description"?: string | null,"seo_title"?: string | null,"slug"?: string,"status"?: Database["public"]['Enums']["content_status"],"title"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "posts_cover_media_id_fkey"
      columns: ["cover_media_id"]
isOneToOne: false
      referencedRelation: "media"
      referencedColumns: ["id"]
    }
                  ]
                },"product_activities": {
                  Row: {
                    "activity_id": string,"product_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "activity_id": string,"product_id": string
                  }
                  Update: {
                    "activity_id"?: string,"product_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "product_activities_activity_id_fkey"
      columns: ["activity_id"]
isOneToOne: false
      referencedRelation: "activities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "product_activities_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    }
                  ]
                },"product_images": {
                  Row: {
                    "alt": string | null,"id": string,"media_id": string,"product_id": string,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "alt"?: string | null,"id"?: string,"media_id": string,"product_id": string,"sort_order"?: number
                  }
                  Update: {
                    "alt"?: string | null,"id"?: string,"media_id"?: string,"product_id"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "product_images_media_id_fkey"
      columns: ["media_id"]
isOneToOne: false
      referencedRelation: "media"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "product_images_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    }
                  ]
                },"products": {
                  Row: {
                    "availability": Database["public"]['Enums']["availability"],"brand_id": string | null,"category_id": string | null,"created_at": string,"created_by": string | null,"currency": string,"description": string | null,"external_label": string | null,"external_url": string | null,"featured": boolean,"id": string,"legacy_key": string | null,"main_image_alt": string | null,"main_image_id": string | null,"name": string,"price_amount": number | null,"price_mode": Database["public"]['Enums']["price_mode"],"price_unit": string | null,"published_at": string | null,"slug": string,"sort_order": number,"spec_line": string | null,"status": Database["public"]['Enums']["content_status"],"tags": (string)[],"type": Database["public"]['Enums']["product_type"],"updated_at": string,"updated_by": string | null,"whatsapp_message": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "availability"?: Database["public"]['Enums']["availability"],"brand_id"?: string | null,"category_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"currency"?: string,"description"?: string | null,"external_label"?: string | null,"external_url"?: string | null,"featured"?: boolean,"id"?: string,"legacy_key"?: string | null,"main_image_alt"?: string | null,"main_image_id"?: string | null,"name": string,"price_amount"?: number | null,"price_mode"?: Database["public"]['Enums']["price_mode"],"price_unit"?: string | null,"published_at"?: string | null,"slug": string,"sort_order"?: number,"spec_line"?: string | null,"status"?: Database["public"]['Enums']["content_status"],"tags"?: (string)[],"type": Database["public"]['Enums']["product_type"],"updated_at"?: string,"updated_by"?: string | null,"whatsapp_message"?: string | null
                  }
                  Update: {
                    "availability"?: Database["public"]['Enums']["availability"],"brand_id"?: string | null,"category_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"currency"?: string,"description"?: string | null,"external_label"?: string | null,"external_url"?: string | null,"featured"?: boolean,"id"?: string,"legacy_key"?: string | null,"main_image_alt"?: string | null,"main_image_id"?: string | null,"name"?: string,"price_amount"?: number | null,"price_mode"?: Database["public"]['Enums']["price_mode"],"price_unit"?: string | null,"published_at"?: string | null,"slug"?: string,"sort_order"?: number,"spec_line"?: string | null,"status"?: Database["public"]['Enums']["content_status"],"tags"?: (string)[],"type"?: Database["public"]['Enums']["product_type"],"updated_at"?: string,"updated_by"?: string | null,"whatsapp_message"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "products_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "products_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "products_main_image_id_fkey"
      columns: ["main_image_id"]
isOneToOne: false
      referencedRelation: "media"
      referencedColumns: ["id"]
    }
                  ]
                },"rental_rate_prices": {
                  Row: {
                    "amount": number,"currency": string,"period": Database["public"]['Enums']["rental_period"],"rate_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"currency"?: string,"period": Database["public"]['Enums']["rental_period"],"rate_id": string
                  }
                  Update: {
                    "amount"?: number,"currency"?: string,"period"?: Database["public"]['Enums']["rental_period"],"rate_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "rental_rate_prices_rate_id_fkey"
      columns: ["rate_id"]
isOneToOne: false
      referencedRelation: "rental_rates"
      referencedColumns: ["id"]
    }
                  ]
                },"rental_rates": {
                  Row: {
                    "created_at": string,"created_by": string | null,"group_name": string | null,"id": string,"legacy_key": string | null,"name": string,"product_id": string | null,"section_id": string,"sort_order": number,"status": Database["public"]['Enums']["content_status"],"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"group_name"?: string | null,"id"?: string,"legacy_key"?: string | null,"name": string,"product_id"?: string | null,"section_id": string,"sort_order"?: number,"status"?: Database["public"]['Enums']["content_status"],"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"group_name"?: string | null,"id"?: string,"legacy_key"?: string | null,"name"?: string,"product_id"?: string | null,"section_id"?: string,"sort_order"?: number,"status"?: Database["public"]['Enums']["content_status"],"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "rental_rates_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "rental_rates_section_id_fkey"
      columns: ["section_id"]
isOneToOne: false
      referencedRelation: "rental_sections"
      referencedColumns: ["id"]
    }
                  ]
                },"rental_sections": {
                  Row: {
                    "created_at": string,"created_by": string | null,"description": string | null,"footnote": string | null,"icon": string | null,"id": string,"is_visible": boolean,"nav_label": string,"periods": (Database["public"]['Enums']["rental_period"])[],"show_resorts": boolean,"slug": string,"sort_order": number,"title": string,"title_accent": string | null,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"description"?: string | null,"footnote"?: string | null,"icon"?: string | null,"id"?: string,"is_visible"?: boolean,"nav_label": string,"periods": (Database["public"]['Enums']["rental_period"])[],"show_resorts"?: boolean,"slug": string,"sort_order"?: number,"title": string,"title_accent"?: string | null,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"description"?: string | null,"footnote"?: string | null,"icon"?: string | null,"id"?: string,"is_visible"?: boolean,"nav_label"?: string,"periods"?: (Database["public"]['Enums']["rental_period"])[],"show_resorts"?: boolean,"slug"?: string,"sort_order"?: number,"title"?: string,"title_accent"?: string | null,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"site_settings": {
                  Row: {
                    "created_at": string,"created_by": string | null,"key": string,"updated_at": string,"updated_by": string | null,"value": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"key": string,"updated_at"?: string,"updated_by"?: string | null,"value": NonNullable<Json>
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"key"?: string,"updated_at"?: string,"updated_by"?: string | null,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    
                  ]
                },"workshop_services": {
                  Row: {
                    "created_at": string,"created_by": string | null,"currency": string,"description": string | null,"icon": string | null,"id": string,"image_media_id": string | null,"is_visible": boolean,"items": (string)[],"kind": string,"legacy_key": string | null,"name": string,"price_amount": number | null,"price_mode": Database["public"]['Enums']["price_mode"],"price_unit": string | null,"season": string | null,"sort_order": number,"updated_at": string,"updated_by": string | null,"whatsapp_message": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"currency"?: string,"description"?: string | null,"icon"?: string | null,"id"?: string,"image_media_id"?: string | null,"is_visible"?: boolean,"items"?: (string)[],"kind": string,"legacy_key"?: string | null,"name": string,"price_amount"?: number | null,"price_mode"?: Database["public"]['Enums']["price_mode"],"price_unit"?: string | null,"season"?: string | null,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null,"whatsapp_message"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"currency"?: string,"description"?: string | null,"icon"?: string | null,"id"?: string,"image_media_id"?: string | null,"is_visible"?: boolean,"items"?: (string)[],"kind"?: string,"legacy_key"?: string | null,"name"?: string,"price_amount"?: number | null,"price_mode"?: Database["public"]['Enums']["price_mode"],"price_unit"?: string | null,"season"?: string | null,"sort_order"?: number,"updated_at"?: string,"updated_by"?: string | null,"whatsapp_message"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "workshop_services_image_media_id_fkey"
      columns: ["image_media_id"]
isOneToOne: false
      referencedRelation: "media"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            "availability": "available"|"unavailable"|"consult","content_status": "draft"|"published"|"archived","post_category": "ECOtrip"|"ECOtip","price_mode": "fixed"|"from"|"consult","product_type": "nuevo"|"usado"|"rental","rental_period": "day"|"weekend"|"three_days"|"four_days"|"week"|"fortnight"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "availability": ["available", "unavailable", "consult"],"content_status": ["draft", "published", "archived"],"post_category": ["ECOtrip", "ECOtip"],"price_mode": ["fixed", "from", "consult"],"product_type": ["nuevo", "usado", "rental"],"rental_period": ["day", "weekend", "three_days", "four_days", "week", "fortnight"]
          }
        }
} as const
