import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, HistoryIcon } from "lucide-react-native";
import { PlantIDRes } from "@/types/types";
import PlantDetailView from "@/components/plant-detail-view";
import { useHistory } from "@/contexts/HistoryContext";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { history, loading, error, selected } = useHistory();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.loadingSubtext}>Loading Identification data</Text>
      </View>
    );
  }

  if (error) {
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

  const result = history.filter((h) => h.id === selected)[0];
  const data = result ? (JSON.parse(result.result) as PlantIDRes) : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {data ? data.result.classification.suggestions[0].name : "Not Found"}
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {data ? (
          <PlantDetailView result={data} />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <HistoryIcon color="#9ca3af" size={48} />
            </View>
            <Text style={styles.emptyTitle}>Not Found</Text>
            <Text style={styles.emptyText}>
              Identification history details was not found
            </Text>
          </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
  },
});
