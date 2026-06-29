import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_CHATS } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function Chats() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <Pressable style={styles.iconBtn}><Ionicons name="search" size={20} color={colors.textPrimary} /></Pressable>
      </View>

      <FlatList
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 64 + insets.bottom + 24, gap: spacing.sm }}
        data={MOCK_CHATS}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <Pressable testID={`chat-${item.id}`} onPress={() => router.push({ pathname: "/student/chat/[id]", params: { id: item.id } })} style={styles.row}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} contentFit="cover" />
              {item.online && <View style={styles.online} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.topLine}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.bottomLine}>
                <Text style={[styles.msg, item.unread > 0 && { color: colors.textPrimary, fontWeight: typography.weightMedium }]} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unread > 0 && (
                  <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>
                )}
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptyBody}>Match with employers to start chatting.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg },
  title: { fontSize: 28, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3, flex: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  avatarWrap: { width: 56, height: 56, position: "relative" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surfaceSoft },
  online: { position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: "#fff" },
  topLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: typography.body, color: colors.textPrimary, fontWeight: typography.weightMedium },
  time: { fontSize: typography.caption, color: colors.textTertiary },
  bottomLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  msg: { fontSize: typography.bodySm, color: colors.textSecondary, flex: 1, marginRight: spacing.sm },
  badge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: typography.weightMedium },
  empty: { alignItems: "center", padding: spacing.xxl, gap: spacing.sm },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: typography.weightMedium },
  emptyBody: { color: colors.textSecondary, fontSize: typography.bodySm, textAlign: "center" },
});
