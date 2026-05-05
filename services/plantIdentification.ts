import { supabase } from "@/lib/supabase";
// import { uploadImage } from "@/lib/upload";
import { PlantIDRes } from "@/types/types";

export async function identifyPlantFromImage(
  imageBase64: string,
): Promise<PlantIDRes> {
  const position =
    "geolocation" in navigator
      ? await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        })
      : null;
  const latitude = position ? position.coords.latitude : undefined;
  const longitude = position ? position.coords.longitude : undefined;
  const response = await fetch(
    "https://plant.id/api/v3/identification?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,best_light_condition,best_soil_type,common_uses,cultural_significance,toxicity,best_watering&language=en",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.EXPO_PUBLIC_PLANT_API_KEY || "",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        similar_images: true,
        images: [imageBase64],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Plant identification API error: ${response.statusText}`);
  }

  // const { data: plantData } = await supabase
  //   .from("plant_species")
  //   .select("*")
  //   .eq("scientific_name", selectedPlant.scientificName)
  //   .maybeSingle();
  const data: PlantIDRes = await response.json();

  return data;
}

export async function saveIdentification(
  userId: string,
  result: string,
  location?: string,
  notes?: string,
) {
  const { data, error } = await supabase
    .from("identifications")
    .insert({
      result,
      user_id: userId,
      location: location || "",
      notes: notes || "",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserIdentifications(userId: string) {
  const { data, error } = await supabase
    .from("identifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getPlantSpeciesByName(scientificName: string) {
  const { data, error } = await supabase
    .from("plant_species")
    .select("*")
    .eq("scientific_name", scientificName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllPlantSpecies() {
  const { data, error } = await supabase
    .from("plant_species")
    .select("*")
    .order("common_name");

  if (error) {
    throw error;
  }

  return data;
}
