import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { SurveyCard } from '@/components/SurveyCard';
import { EmptyState } from '@/components/EmptyState';
import { useSurveys } from '@/store/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Survey } from '@/constants/types';

const FILTER_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Critical'] as const;

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys, deleteSurvey } = useSurveys();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return surveys.filter((s) => {
      const matchesSearch =
        s.siteName.toLowerCase().includes(search.toLowerCase()) ||
        s.clientName.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || s.priority === filter;
      return matchesSearch && matchesFilter;
    });
  }, [surveys, search, filter]);

  const handleDelete = (survey: Survey) => {
    Alert.alert('Delete Survey', `Delete "${survey.siteName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSurvey(survey.id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Survey History" subtitle={`${surveys.length} total surveys`} />

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.icon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search surveys..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.icon} />
          </Pressable>
        )}
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((f) => {
          const isActive = filter === f;
          return (
            <Pressable
              key={f}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: isActive ? colors.tint : colors.inputBg,
                  borderColor: isActive ? colors.tint : colors.border,
                },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? '#FFFFFF' : colors.text },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Results count */}
      <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
        {filtered.length} survey{filtered.length !== 1 ? 's' : ''} found
      </Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurveyCard
            survey={item}
            onPress={() =>
              router.push({ pathname: '/survey/preview', params: { id: item.id } })
            }
            onDelete={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Surveys Found"
            message="Try adjusting your search or filter criteria."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  list: {
    paddingVertical: 8,
  },
});
