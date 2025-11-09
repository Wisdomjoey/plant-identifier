export type PlantIDRes = {
  access_token: string;
  model_version: string;
  custom_id: null;
  input: {
    latitude: number;
    longitude: number;
    similar_images: true;
    images: string[];
    datetime: string;
  };
  result: {
    is_plant: {
      probability: number;
      threshold: number;
      binary: boolean;
    };
    classification: {
      suggestions: {
        id: string;
        name: string;
        probability: number;
        similar_images: {
          id: string;
          url: string;
          license_name: string;
          license_url: string;
          citation: string;
          similarity: number;
          url_small: string;
        }[];
        details: {
          common_names: string[] | null;
          taxonomy: {
            class: string;
            genus: string;
            order: string;
            family: string;
            phylum: string;
            kingdom: string;
          };
          url: string;
          gbif_id: number;
          inaturalist_id: number;
          rank: string;
          description: {
            value: string;
            citation: string;
            license_name: string;
            license_url: string;
          };
          synonyms: string[];
          image: {
            value: string;
            citation: string;
            license_name: string;
            license_url: string;
          };
          edible_parts: string | null;
          watering: {
            max: 2;
            min: 2;
          };
          best_light_condition: string;
          best_soil_type: string;
          common_uses: string;
          cultural_significance: string;
          toxicity: string;
          best_watering: string;
          language: string;
          entity_id: string;
        };
      }[];
    };
  };
  status: string;
  sla_compliant_client: boolean;
  sla_compliant_system: boolean;
  created: number;
  completed: number;
};
