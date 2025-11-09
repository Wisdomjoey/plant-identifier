export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PlantSpecies {
  id: string;
  common_name: string;
  scientific_name: string;
  family?: string;
  description?: string;
  habitat?: string;
  flowering_season?: string;
  uses?: string;
  image_url?: string;
  created_at: string;
}

export interface Identification {
  id: string;
  user_id: string;
  location?: string;
  notes?: string;
  created_at: string;
  result: string;
}
