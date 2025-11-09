import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  CheckCircle,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { PlantIDRes } from "@/types/types";
import { getConfidenceColor } from "@/lib/utils";

export default function PlantDetailView({
  result,
  saving,
  children,
  handleSave,
}: {
  saving?: boolean;
  result: PlantIDRes;
  handleSave?: () => void;
  children?: React.ReactNode;
}) {
  const [pageView, setPageView] = useState({
    page: 0,
    index: 0,
  });

  const data = result?.result.classification.suggestions[pageView.page];
  const length = (result?.result.classification.suggestions.length || 1) - 1;
  const images = [
    ...(data?.details.image ? [data?.details.image.value] : ""),
    ...(data?.similar_images ?? []).map((img) => img.url),
  ];

  if (!result.result.is_plant.binary) {
    return (
      <View style={styles.content}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Leaf color="#9ca3af" size={48} />
          </View>
          <Text style={styles.emptyTitle}>Unidentified</Text>
          <Text style={styles.emptyText}>
            This is most likely not a plant, please retry with a different image
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <View style={styles.imgContainer}>
        <View style={styles.imgControls}>
          <TouchableOpacity
            onPress={() =>
              setPageView((prev) => ({
                ...prev,
                index: prev.index <= 0 ? 0 : prev.index - 1,
              }))
            }
            style={[
              styles.imgControl,
              pageView.index <= 0 ? styles.saveButtonDisabled : null,
            ]}
          >
            <ChevronLeft color={"#fff"} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setPageView((prev) => ({
                ...prev,
                index:
                  prev.index >= images.length - 1
                    ? images.length - 1
                    : prev.index + 1,
              }))
            }
            style={[
              styles.imgControl,
              pageView.index >= images.length - 1
                ? styles.saveButtonDisabled
                : null,
            ]}
          >
            <ChevronRight color={"#fff"} size={20} />
          </TouchableOpacity>
        </View>

        <Image
          style={styles.image}
          source={{
            uri: images[pageView.index],
          }}
        />
      </View>

      <View style={styles.resultCard}>
        <View style={styles.confidenceBadge}>
          <CheckCircle
            color={getConfidenceColor((data?.probability ?? 0) * 100)}
            size={20}
          />

          <Text
            style={[
              styles.confidenceText,
              { color: getConfidenceColor((data?.probability ?? 0) * 100) },
            ]}
          >
            {(data?.probability ?? 0) * 100}% Match
          </Text>
        </View>

        <Text style={styles.commonName}>{data?.name}</Text>

        <Text style={styles.scientificName}>
          Common Names:{" "}
          {data?.details.common_names
            ? data?.details.common_names.join(", ")
            : "N/A"}
        </Text>

        <View style={styles.infoRows}>
          {data?.details.taxonomy.kingdom && (
            <View style={styles.infoRow}>
              <Leaf color="#6b7280" size={18} />
              <Text style={styles.infoText}>
                Kingdom: {data?.details.taxonomy.kingdom}
              </Text>
            </View>
          )}

          {data?.details.taxonomy.family && (
            <View style={styles.infoRow}>
              <Leaf color="#6b7280" size={18} />
              <Text style={styles.infoText}>
                Family: {data?.details.taxonomy.family}
              </Text>
            </View>
          )}

          {data?.details.taxonomy.class && (
            <View style={styles.infoRow}>
              <Leaf color="#6b7280" size={18} />
              <Text style={styles.infoText}>
                Class: {data?.details.taxonomy.class}
              </Text>
            </View>
          )}

          {data?.details.taxonomy.order && (
            <View style={styles.infoRow}>
              <Leaf color="#6b7280" size={18} />
              <Text style={styles.infoText}>
                Order: {data?.details.taxonomy.order}
              </Text>
            </View>
          )}

          {data?.details.taxonomy.genus && (
            <View style={styles.infoRow}>
              <Leaf color="#6b7280" size={18} />
              <Text style={styles.infoText}>
                Genus: {data?.details.taxonomy.genus}
              </Text>
            </View>
          )}

          {data?.details.taxonomy.phylum && (
            <View style={styles.infoRow}>
              <Leaf color="#6b7280" size={18} />
              <Text style={styles.infoText}>
                Phylum: {data?.details.taxonomy.phylum}
              </Text>
            </View>
          )}
        </View>

        {data?.details.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>
              {data?.details.description.value}
            </Text>
          </View>
        )}

        {data?.details.best_soil_type && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soil Type</Text>
            <Text style={styles.sectionText}>
              {data?.details.best_soil_type}
            </Text>
          </View>
        )}

        {data?.details.best_light_condition && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Light Condition</Text>
            <Text style={styles.sectionText}>
              {data?.details.best_light_condition}
            </Text>
          </View>
        )}

        {data?.details.common_uses && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Uses</Text>
            <Text style={styles.sectionText}>{data?.details.common_uses}</Text>
          </View>
        )}
      </View>

      {children}

      <View style={[styles.actionBtns, styles.pad]}>
        {handleSave && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>Save to History</Text>
            )}
          </TouchableOpacity>
        )}

        {length > 1 && (
          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                (saving || pageView.page <= 0) && styles.saveButtonDisabled,
              ]}
              onPress={() =>
                setPageView((prev) => ({
                  index: 0,
                  page: prev.page <= 0 ? 0 : prev.page - 1,
                }))
              }
              disabled={saving || pageView.page <= 0}
            >
              <Text style={styles.pageButtonText}>Prev</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pageButton,
                (saving || pageView.page >= length) &&
                  styles.saveButtonDisabled,
              ]}
              onPress={() =>
                setPageView((prev) => ({
                  index: 0,
                  page: prev.page >= length ? length : prev.page + 1,
                }))
              }
              disabled={saving || pageView.page >= length}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#e5e7eb",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  commonName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#6b7280",
    marginBottom: 16,
  },
  infoRows: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 21,
  },
  saveButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  pageButton: {
    borderColor: "#c4c4c4ff",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  pageButtonText: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 32,
  },
  imgContainer: {
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
  },
  imgControls: {
    flex: 1,
    zIndex: 10,
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgControl: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  actionBtns: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    width: "100%",
    flex: 1,
  },
  pad: {
    marginHorizontal: 20,
    marginTop: 16,
  },
});
