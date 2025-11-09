import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Calendar, MapPin, History as HistoryIcon } from "lucide-react-native";
import { PlantIDRes } from "@/types/types";
import { formatDate, getConfidenceColor } from "@/lib/utils";
import { useHistory } from "@/contexts/HistoryContext";
import { Identification } from "@/types/database";
import { useRouter } from "expo-router";

export default function HistoryScreen() {
  const router = useRouter();
  const { history, loadHistory, loading, error, setSelected } = useHistory();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Identification }) => {
    const result = (JSON.parse(item.result) as PlantIDRes).result.classification
      .suggestions[0];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelected(item.id);
          router.push("/history-detail");
        }}
      >
        <Image
          source={{ uri: result.details.image.value }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{result.name}</Text>
            <View
              style={[
                styles.confidenceBadge,
                {
                  backgroundColor: `${getConfidenceColor(
                    result.probability * 100
                  )}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.confidenceText,
                  { color: getConfidenceColor(result.probability * 100) },
                ]}
              >
                {result.probability * 100}%
              </Text>
            </View>
          </View>

          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Calendar color="#6b7280" size={14} />
              <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
            </View>

            {item.location ? (
              <View style={styles.metaItem}>
                <MapPin color="#6b7280" size={14} />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            ) : null}
          </View>

          {item.notes ? (
            <Text style={styles.cardNotes} numberOfLines={2}>
              {item.notes}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Fetch Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadHistory} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HistoryIcon color="#10b981" size={28} />
        <Text style={styles.headerTitle}>Identification History</Text>
      </View>

      {history.length <= 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <HistoryIcon color="#9ca3af" size={48} />
          </View>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Start identifying plants to build your collection
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10b981"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
  header: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e5e7eb",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  cardNotes: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 21,
    marginTop: 4,
  },
});
