import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ActionCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export function ActionCard({ title, icon, color, onPress }: ActionCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    margin: 6,
    minWidth: 140,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
