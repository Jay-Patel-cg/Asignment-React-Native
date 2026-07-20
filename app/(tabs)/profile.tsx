import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useSurveys } from '@/store/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys, todayCount } = useSurveys();

  const submitted = surveys.filter((s) => s.status === 'submitted').length;
  const drafts = surveys.filter((s) => s.status === 'draft').length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarText}>SN</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>Student Name</Text>
          <Text style={[styles.role, { color: colors.textSecondary }]}>Field Surveyor</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.success }]}>{submitted}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Submitted</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.warning }]}>{drafts}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Drafts</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.info }]}>{todayCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today</Text>
          </View>
        </View>

        {/* Info Items */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'person-outline' as const, label: 'Name', value: 'Student Name' },
            { icon: 'mail-outline' as const, label: 'Email', value: 'student@university.edu' },
            { icon: 'school-outline' as const, label: 'Department', value: 'Civil Engineering' },
            { icon: 'id-card-outline' as const, label: 'Employee ID', value: 'STU-2026-001' },
            { icon: 'call-outline' as const, label: 'Phone', value: '+1-555-0000' },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                index < 4 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Ionicons name={item.icon} size={20} color={colors.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'notifications-outline' as const, label: 'Notifications', color: colors.info },
            { icon: 'help-circle-outline' as const, label: 'Help & Support', color: colors.success },
            { icon: 'information-circle-outline' as const, label: 'About', color: colors.warning },
          ].map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.actionRow,
                index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
              onPress={() => Alert.alert(item.label, 'Coming soon!')}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.icon} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  role: {
    fontSize: 14,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoContent: {
    marginLeft: 14,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
    flex: 1,
  },
});
