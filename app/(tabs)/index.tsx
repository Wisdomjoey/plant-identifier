import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Leaf, Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleCamera = () => {
    router.push('/camera');
  };

  const handleGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need permission to access your photo library'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        router.push({
          pathname: '/identify',
          params: {
            imageUri: asset.uri,
            imageBase64: asset.base64 || '',
          },
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Leaf color="#10b981" size={32} />
          <Text style={styles.headerTitle}>Lagos Flora ID</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Identify flowering plants in Lagos State&apos;s tropical zones
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Sparkles color="#10b981" size={48} />
          </View>
          <Text style={styles.heroTitle}>AI-Powered Plant Recognition</Text>
          <Text style={styles.heroText}>
            Capture or upload a photo of any flowering plant and let our computer vision
            system identify it instantly with detailed information.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCamera}>
            <View style={styles.buttonIcon}>
              <Camera color="#ffffff" size={28} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Take Photo</Text>
              <Text style={styles.buttonSubtitle}>Use your camera to identify</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGallery}>
            <View style={styles.buttonIcon}>
              <ImageIcon color="#10b981" size={28} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.secondaryButtonTitle}>Upload Photo</Text>
              <Text style={styles.secondaryButtonSubtitle}>
                Choose from your gallery
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Features</Text>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Leaf color="#10b981" size={20} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Lagos-Specific Database</Text>
              <Text style={styles.featureText}>
                Curated database of flowering plants found in Lagos State&apos;s humid tropical
                agro-ecological zones
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Sparkles color="#10b981" size={20} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Machine Learning</Text>
              <Text style={styles.featureText}>
                Advanced computer vision algorithms for accurate plant identification
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Camera color="#10b981" size={20} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instant Results</Text>
              <Text style={styles.featureText}>
                Get detailed information including scientific names, families, and uses
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips for Best Results</Text>
          <Text style={styles.tipText}>• Capture the flower clearly and close-up</Text>
          <Text style={styles.tipText}>• Ensure good lighting conditions</Text>
          <Text style={styles.tipText}>• Include leaves if visible</Text>
          <Text style={styles.tipText}>• Avoid blurry or shadowed images</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 21,
  },
  content: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 21,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  secondaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  secondaryButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  features: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 21,
  },
  tips: {
    backgroundColor: '#fffbeb',
    padding: 20,
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#78350f',
    marginBottom: 6,
    lineHeight: 21,
  },
});
