import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Camera, FlipHorizontal2, X } from "lucide-react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera color="#10b981" size={64} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to access the camera to identify plants
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!cameraRef.current || loading) return;

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      router.push({
        pathname: "/identify",
        params: {
          imageUri: photo.uri,
          imageBase64: photo.base64,
        },
      });
    } catch (error) {
      console.error("Error taking picture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color="#ffffff" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Position plant in frame</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>

        <View style={styles.controls}>
          <View style={styles.controlsContent}>
            <View style={styles.placeholder} />

            <TouchableOpacity
              style={[
                styles.captureButton,
                loading && styles.captureButtonDisabled,
              ]}
              onPress={takePicture}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="large" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <FlipHorizontal2 color="#ffffff" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#ffffff",
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholder: {
    width: 44,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "#10b981",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  controls: {
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    paddingHorizontal: 20,
  },
  controlsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#10b981",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10b981",
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
