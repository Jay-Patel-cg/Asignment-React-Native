import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Survey } from '@/constants/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SurveyCardProps {
  survey: Survey;
  onPress: () => void;
  onDelete?: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#22C55E',
  Medium: '#F59E0B',
  High: '#F97316',
  Critical: '#EF4444',
};

export function SurveyCard({ survey, onPress, onDelete }: SurveyCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const priorityColor = PRIORITY_COLORS[survey.priority] || colors.warning;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {survey.photoUri ? (
        <Image source={{ uri: survey.photoUri }} style={styles.photo} />
      ) : (
        <View style={[styles.photoPlaceholder, { backgroundColor: colors.inputBg }]}>
          <Ionicons name="image-outline" size={24} color={colors.icon} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.siteName, { color: colors.text }]} numberOfLines={1}>
            {survey.siteName}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>{survey.priority}</Text>
          </View>
        </View>

        <Text style={[styles.client, { color: colors.textSecondary }]} numberOfLines={1}>
          {survey.clientName}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.date, { color: colors.textSecondary }]}>{survey.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: survey.status === 'submitted' ? colors.success + '20' : colors.warning + '20' }]}>
            <Text style={[styles.statusText, { color: survey.status === 'submitted' ? colors.success : colors.warning }]}>
              {survey.status === 'submitted' ? 'Submitted' : 'Draft'}
            </Text>
          </View>
        </View>
      </View>

      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  siteName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  client: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 4,
  },
});
