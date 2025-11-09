import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  Calendar,
  Leaf,
  LogOut,
  ChevronRight,
  Info,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ totalIdentifications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const { count } = await supabase
        .from("identifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setProfile(profileData);
      setStats({ totalIdentifications: count || 0 });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (
      Platform.OS === "web" &&
      window.confirm("Are you sure you want to sign out?")
    ) {
      await signOut();
      router.replace("/auth/sign-in");
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/auth/sign-in");
          },
        },
      ]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <User color="#10b981" size={28} />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color="#10b981" size={48} />
            </View>
          </View>

          <Text style={styles.name}>{profile?.full_name || "User"}</Text>
          <Text style={styles.email}>{profile?.email}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalIdentifications}</Text>
              <Text style={styles.statLabel}>Identifications</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Mail color="#6b7280" size={20} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
            </View>

            {profile?.created_at && (
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Calendar color="#6b7280" size={20} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(profile.created_at)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Leaf color="#10b981" size={20} />
                </View>
                <Text style={styles.menuText}>Plant Database</Text>
              </View>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Info color="#10b981" size={20} />
                </View>
                <Text style={styles.menuText}>About Lagos Flora ID</Text>
              </View>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color="#ef4444" size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
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
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
    width: "100%",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#10b981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 8,
  },
  version: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
  },
});
