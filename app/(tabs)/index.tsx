import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { ActionCard } from '@/components/ActionCard';
import { SurveyCard } from '@/components/SurveyCard';
import { useSurveys } from '@/store/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys, todayCount } = useSurveys();
  const [refreshing, setRefreshing] = React.useState(false);

  const recentSurveys = surveys.slice(0, 3);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Dashboard" subtitle="Welcome back, Student!" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.tint }]}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>Good Morning!</Text>
            <Text style={styles.welcomeSub}>Student Name</Text>
            <Text style={styles.welcomeDetail}>ID: STU-2026-001 | B.Tech Civil Engineering</Text>
          </View>
          <Ionicons name="school-outline" size={64} color="rgba(255,255,255,0.3)" />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="document-text" size={24} color={colors.info} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Surveys</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="today" size={24} color={colors.success} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{todayCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="checkmark-circle" size={24} color={colors.warning} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {surveys.filter((s) => s.status === 'submitted').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Submitted</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard
            title="New Survey"
            icon="add-circle"
            color={colors.info}
            onPress={() => router.push('/(tabs)/new-survey')}
          />
          <ActionCard
            title="Camera"
            icon="camera"
            color="#8B5CF6"
            onPress={() => router.push('/camera')}
          />
          <ActionCard
            title="Location"
            icon="location"
            color={colors.success}
            onPress={() => router.push('/location')}
          />
          <ActionCard
            title="Contacts"
            icon="people"
            color="#EC4899"
            onPress={() => router.push('/contacts')}
          />
          <ActionCard
            title="Clipboard"
            icon="clipboard"
            color={colors.warning}
            onPress={() => router.push('/clipboard')}
          />
          <ActionCard
            title="History"
            icon="time"
            color="#14B8A6"
            onPress={() => router.push('/(tabs)/history')}
          />
        </View>

        {/* Recent Surveys */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Surveys</Text>
        {recentSurveys.length > 0 ? (
          recentSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onPress={() =>
                router.push({ pathname: '/survey/preview', params: { id: survey.id } })
              }
            />
          ))
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="document-outline" size={36} color={colors.icon} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {'No surveys yet. Tap "New Survey" to get started.'}
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
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
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  welcomeSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  welcomeDetail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
