export interface Place {
  place_id: number;
  name: string;
  address: string;
  address_la: string;
  address_lo: string;
  type: string;
  count: number;
  website?: string | null;
  image_url?: string | null;
  insta_nickname?: string | null;
  open_hour?: string | null;
  close_hour?: string | null;
  description?: string | null;
  created_at: string; // ISO 8601 문자열 (예: "2025-10-13T11:30:00Z")
  deleted_at?: string | null;
  updated_at: string;
}