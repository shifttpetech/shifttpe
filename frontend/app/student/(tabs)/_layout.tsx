import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadows, typography } from "@/src/theme";

function CenterFab() {
  const router = useRouter();
  return (
    <Pressable testID="student-center-fab" onPress={() => router.push("/student/notifications")} style={({ pressed }) => [styles.fab, shadows.button, { opacity: pressed ? 0.9 : 1 }]}>
      <Ionicons name="flash" size={26} color="#fff" />
    </Pressable>
  );
}

export default function StudentTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { ...styles.tabBar, height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: typography.weightMedium, marginTop: -2 },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarIcon: ({ color, focused }) => {
          const map: Record<string, any> = {
            swipe: focused ? "heart" : "heart-outline",
            chats: focused ? "chatbubbles" : "chatbubbles-outline",
            center: "ellipse",
            shifts: focused ? "calendar" : "calendar-outline",
            profile: focused ? "person" : "person-outline",
          };
          if (route.name === "center") return null;
          return <Ionicons name={map[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="swipe" options={{ title: "Swipe" }} />
      <Tabs.Screen name="chats" options={{ title: "Chats", tabBarBadge: 2 }} />
      <Tabs.Screen
        name="center"
        options={{
          title: "",
          tabBarButton: () => <View style={{ flex: 1, alignItems: "center" }}><CenterFab /></View>,
        }}
      />
      <Tabs.Screen name="shifts" options={{ title: "My Shifts" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    paddingTop: 8,
    elevation: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  fab: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center", marginTop: -18,
    borderWidth: 4, borderColor: "#fff",
  },
});
