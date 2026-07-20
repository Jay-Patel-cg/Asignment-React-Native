import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDrawer } from '@/store/DrawerContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function AppHeader({ title, subtitle, rightIcon, onRightPress }: AppHeaderProps) {
  const { toggleDrawer } = useDrawer();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Pressable onPress={toggleDrawer} style={styles.menuBtn}>
        <Ionicons name="menu" size={24} color={colors.text} />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon && onRightPress ? (
        <Pressable onPress={onRightPress} style={styles.actionBtn}>
          <Ionicons name={rightIcon} size={24} color={colors.tint} />
        </Pressable>
      ) : (
        <View style={styles.actionBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  menuBtn: {
    padding: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 1,
  },
  actionBtn: {
    padding: 8,
    marginLeft: 12,
    width: 40,
    alignItems: 'center',
  },
});
