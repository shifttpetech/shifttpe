import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_CHATS } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

const INITIAL = [
  { id: "m1", text: "Hi! Thanks for showing interest 👋", mine: false, time: "10:32" },
  { id: "m2", text: "Hi! When can I start?", mine: true, time: "10:34" },
  { id: "m3", text: "Can you start tomorrow at 6 PM evening shift?", mine: false, time: "10:35" },
];

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chat = MOCK_CHATS.find(c => c.id === id) || MOCK_CHATS[0];
  const [msgs, setMsgs] = useState(INITIAL);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs(m => [{ id: `m_${Date.now()}`, text: text.trim(), mine: true, time: "now" }, ...m]);
    setText("");
    setTimeout(() => {
      setMsgs(m => [{ id: `m_${Date.now()}r`, text: "Sounds good! See you soon 🙌", mine: false, time: "now" }, ...m]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.status}>{chat.online ? "Online" : "Last seen recently"}</Text>
        </View>
        <Pressable style={styles.iconBtn}><Ionicons name="call" size={18} color={colors.primary} /></Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={80}>
        <FlatList
          data={msgs}
          inverted
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          renderItem={({ item }) => (
            <View style={[styles.bubbleWrap, item.mine ? styles.mine : styles.theirs]}>
              <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, item.mine && { color: "#fff" }]}>{item.text}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />

        <View style={[styles.composer, { paddingBottom: spacing.md + insets.bottom }]}>
          <Pressable style={styles.cBtn}><Ionicons name="attach" size={20} color={colors.textSecondary} /></Pressable>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            testID="chat-input"
          />
          {text ? (
            <Pressable testID="chat-send" onPress={send} style={[styles.cBtn, styles.sendBtn]}><Ionicons name="send" size={18} color="#fff" /></Pressable>
          ) : (
            <Pressable style={styles.cBtn}><Ionicons name="mic" size={20} color={colors.primary} /></Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  name: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  status: { color: colors.success, fontSize: typography.caption },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  bubbleWrap: { maxWidth: "78%", gap: 2 },
  mine: { alignSelf: "flex-end", alignItems: "flex-end" },
  theirs: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.xl },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  bubbleTheirs: { backgroundColor: colors.surfaceSoft, borderBottomLeftRadius: 6 },
  bubbleText: { color: colors.textPrimary, fontSize: typography.bodySm, lineHeight: 20 },
  time: { color: colors.textTertiary, fontSize: 10, paddingHorizontal: 4 },
  composer: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider, backgroundColor: "#fff" },
  cBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sendBtn: { backgroundColor: colors.primary },
  input: { flex: 1, height: 44, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surfaceSoft, color: colors.textPrimary, fontSize: typography.bodySm },
});
