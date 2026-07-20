import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Contact } from '@/constants/types';

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const fetchContacts = useCallback(async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setHasPermission(status === 'granted');

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Contacts permission is needed to display your contacts.');
      return;
    }

    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
      });

      const formatted: Contact[] = data
        .filter((c) => c.firstName || c.lastName)
        .map((c) => ({
          id: c.id || Math.random().toString(),
          name: `${c.firstName || ''} ${c.lastName || ''}`.trim(),
          firstName: c.firstName || '',
          lastName: c.lastName || '',
          phoneNumber: c.phoneNumbers?.[0]?.number || '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setContacts(formatted);
    } catch {
      Alert.alert('Error', 'Failed to fetch contacts.');
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, [fetchContacts]);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber.includes(search)
  );

  const copyNumber = async (number: string) => {
    await Clipboard.setStringAsync(number);
    Alert.alert('Copied!', `Number copied: ${number}`);
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase() || '?';
  };

  const getInitialColor = (name: string) => {
    const colorsPalette = ['#2563EB', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#22C55E', '#14B8A6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colorsPalette[Math.abs(hash) % colorsPalette.length];
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: getInitialColor(item.name) }]}>
        <Text style={styles.avatarText}>{getInitial(item.name)}</Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        {item.phoneNumber ? (
          <Text style={[styles.contactNumber, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.phoneNumber}
          </Text>
        ) : (
          <Text style={[styles.noNumber, { color: colors.danger }]}>No Number</Text>
        )}
      </View>

      {item.phoneNumber && (
        <Pressable style={styles.copyBtn} onPress={() => copyNumber(item.phoneNumber)}>
          <Ionicons name="copy-outline" size={20} color={colors.tint} />
        </Pressable>
      )}
    </View>
  );

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Contacts" />
        <View style={styles.center}>
          <Ionicons name="people-outline" size={64} color={colors.icon} />
          <Text style={[styles.permTitle, { color: colors.text }]}>Permission Required</Text>
          <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
            Contacts permission is needed to display your contact list.
          </Text>
          <Pressable style={[styles.permBtn, { backgroundColor: colors.tint }]} onPress={fetchContacts}>
            <Text style={styles.permBtnText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Contacts" subtitle={`${contacts.length} contacts loaded`} />

      {/* Search & Counter */}
      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search contacts..."
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
      </View>

      <View style={[styles.counterRow, { backgroundColor: colors.tint + '10' }]}>
        <Ionicons name="people" size={16} color={colors.tint} />
        <Text style={[styles.counterText, { color: colors.tint }]}>
          {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
          {search ? ' found' : ' total'}
        </Text>
      </View>

      {/* Contact List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Contacts"
            message={search ? 'No contacts match your search.' : 'Your contact list is empty or permission was denied.'}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  permDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  permBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  list: {
    paddingVertical: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactNumber: {
    fontSize: 13,
    marginTop: 2,
  },
  noNumber: {
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic',
  },
  copyBtn: {
    padding: 8,
  },
});
