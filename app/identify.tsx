import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  identifyPlantFromImage,
  saveIdentification,
} from "@/services/plantIdentification";
import { MapPin, FileText, ArrowLeft } from "lucide-react-native";
import { PlantIDRes } from "@/types/types";
import PlantDetailView from "@/components/plant-detail-view";

export default function IdentifyScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<PlantIDRes>();

  useEffect(() => {
    identifyPlant();
  }, []);

  const identifyPlant = async () => {
    try {
      setLoading(true);
      setError("");

      const imageBase64 = params.imageBase64 as string;
      const identificationResult = await identifyPlantFromImage(imageBase64);

      setResult(identificationResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to identify plant. Please try again."
      );

      console.error("Identification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;

    try {
      setSaving(true);
      await saveIdentification(
        user.id,
        JSON.stringify(result),
        location,
        notes
      );

      router.replace("/(tabs)/history");
    } catch (err) {
      setError("Failed to save identification");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Analyzing plant...</Text>
        <Text style={styles.loadingSubtext}>
          Using computer vision to identify species
        </Text>
      </View>
    );
  }

  if (error && !result) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Identification Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Identification Result</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {result && (
          <PlantDetailView
            result={result}
            saving={saving}
            handleSave={handleSave}
          >
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalTitle}>Add Details (Optional)</Text>

              <View style={styles.inputContainer}>
                <MapPin color="#6b7280" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Location (e.g., Lekki Phase 1)"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <FileText color="#6b7280" size={20} />
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Notes about this plant"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </PlantDetailView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 24,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  additionalInfo: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: 16,
  },
  additionalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginLeft: 8,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
});
