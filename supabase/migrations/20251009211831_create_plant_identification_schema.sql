/*
  # Plant Identification System Schema

  ## Overview
  This migration creates the database schema for a plant identification mobile application
  focused on flowering plants in Lagos State, Nigeria's humid tropical agro-ecological zones.

  ## New Tables
  
  ### 1. `profiles`
  User profile information linked to Supabase auth
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `plant_species`
  Reference database of flowering plants in Lagos State
  - `id` (uuid, primary key) - Unique identifier
  - `common_name` (text) - Common name of the plant
  - `scientific_name` (text) - Scientific/botanical name
  - `family` (text) - Plant family classification
  - `description` (text) - Detailed plant description
  - `habitat` (text) - Natural habitat information
  - `flowering_season` (text) - When the plant typically flowers
  - `uses` (text) - Traditional and modern uses
  - `image_url` (text) - Reference image URL
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `identifications`
  History of plant identifications made by users
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `image_url` (text) - URL of the uploaded/captured image
  - `identified_species` (text) - Identified plant species name
  - `confidence_score` (decimal) - ML confidence score (0-100)
  - `location` (text) - Optional location data
  - `notes` (text) - User notes about the identification
  - `created_at` (timestamptz) - Identification timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Profiles: Users can only read/update their own profile
  - Plant species: Public read access, admin write access
  - Identifications: Users can only access their own identification history

  ## Important Notes
  - All timestamps use Lagos timezone awareness
  - Image URLs will reference Supabase Storage or external storage
  - Confidence scores help users understand ML prediction reliability
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create plant_species reference table
CREATE TABLE IF NOT EXISTS plant_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  common_name text NOT NULL,
  scientific_name text NOT NULL UNIQUE,
  family text,
  description text,
  habitat text,
  flowering_season text,
  uses text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create identifications history table
CREATE TABLE IF NOT EXISTS identifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  identified_species text NOT NULL,
  confidence_score decimal(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  location text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE identifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Plant species policies (public read access)
CREATE POLICY "Anyone can view plant species"
  ON plant_species FOR SELECT
  TO authenticated
  USING (true);

-- Identifications policies
CREATE POLICY "Users can view own identifications"
  ON identifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own identifications"
  ON identifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own identifications"
  ON identifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own identifications"
  ON identifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_identifications_user_id ON identifications(user_id);
CREATE INDEX IF NOT EXISTS idx_identifications_created_at ON identifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plant_species_common_name ON plant_species(common_name);
CREATE INDEX IF NOT EXISTS idx_plant_species_scientific_name ON plant_species(scientific_name);

-- Insert sample flowering plant species found in Lagos State, Nigeria
INSERT INTO plant_species (common_name, scientific_name, family, description, habitat, flowering_season, uses) VALUES
('Flame of the Forest', 'Delonix regia', 'Fabaceae', 'Large deciduous tree with brilliant red-orange flowers. Crown is broad and spreading with feathery foliage.', 'Roadside trees, parks, and gardens in urban Lagos', 'Dry season (December to March)', 'Ornamental shade tree, traditional medicine for inflammation'),
('Yellow Oleander', 'Thevetia peruviana', 'Apocynaceae', 'Evergreen shrub with bright yellow trumpet-shaped flowers. All parts are highly toxic.', 'Gardens, hedges, and roadsides throughout Lagos', 'Year-round, peak in rainy season', 'Ornamental landscaping (caution: poisonous)'),
('Bougainvillea', 'Bougainvillea glabra', 'Nyctaginaceae', 'Thorny ornamental vine with vibrant papery bracts in purple, pink, red, or white surrounding small white flowers.', 'Gardens, walls, and fences across Lagos homes', 'Year-round in tropical climate', 'Ornamental decoration, hedging, erosion control'),
('Pride of Barbados', 'Caesalpinia pulcherrima', 'Fabaceae', 'Showy shrub with bright red and yellow flowers with prominent red stamens. Fast-growing ornamental.', 'Gardens and parks in Lagos State', 'Year-round, especially rainy season', 'Ornamental landscaping, traditional fever treatment'),
('Ixora', 'Ixora coccinea', 'Rubiaceae', 'Dense flowering shrub with clusters of small tubular flowers in red, orange, pink, or yellow.', 'Common hedge plant in Lagos gardens', 'Year-round flowering', 'Ornamental hedges, traditional medicine for wounds'),
('African Tulip Tree', 'Spathodea campanulata', 'Bignoniaceae', 'Large tree with stunning orange-red bell-shaped flowers clustered at branch tips.', 'Parks, streets, and compounds throughout Lagos', 'Peak flowering January to April', 'Ornamental shade tree, traditional medicine'),
('Frangipani', 'Plumeria rubra', 'Apocynaceae', 'Small tree with fragrant waxy flowers in white, yellow, pink, or red. Thick branches with milky sap.', 'Gardens and hotel landscapes in Lagos', 'Dry season (December to April)', 'Ornamental, perfumery, traditional medicine'),
('Hibiscus', 'Hibiscus rosa-sinensis', 'Malvaceae', 'Popular shrub with large showy flowers in many colors. Glossy leaves and prominent central stamen.', 'Extremely common in Lagos home gardens', 'Year-round flowering', 'Ornamental, beverage (hibiscus tea), hair care'),
('Morning Glory', 'Ipomoea cairica', 'Convolvulaceae', 'Vigorous climbing vine with purple, pink or white trumpet flowers that open in morning.', 'Fences, walls, and waste areas in Lagos', 'Year-round, peak in rainy season', 'Ornamental cover, can become invasive'),
('Golden Trumpet', 'Allamanda cathartica', 'Apocynaceae', 'Climbing shrub with glossy leaves and bright yellow trumpet-shaped flowers.', 'Gardens and fences throughout Lagos', 'Year-round in humid climate', 'Ornamental landscaping (caution: toxic if ingested)');
