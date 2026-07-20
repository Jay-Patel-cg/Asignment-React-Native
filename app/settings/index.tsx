import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [autoSave, setAutoSave] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" subtitle="App preferences" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* General */}
        <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>GENERAL</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications" size={22} color={colors.info} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.inputBg, true: colors.tint + '60' }}
              thumbColor={notifications ? colors.tint : colors.icon}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon" size={22} color="#8B5CF6" />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.inputBg, true: '#8B5CF660' }}
              thumbColor={darkMode ? '#8B5CF6' : colors.icon}
            />
          </View>

          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="save" size={22} color={colors.success} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Auto Save</Text>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: colors.inputBg, true: colors.success + '60' }}
              thumbColor={autoSave ? colors.success : colors.icon}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="navigate" size={22} color={colors.warning} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Background Location</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: colors.inputBg, true: colors.warning + '60' }}
              thumbColor={locationTracking ? colors.warning : colors.icon}
            />
          </View>
        </View>

        {/* Data */}
        <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>DATA</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={() => Alert.alert('Export', 'Exporting survey data...')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="download" size={22} color={colors.tint} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.icon} />
          </Pressable>

          <Pressable
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={() => Alert.alert('Clear Cache', 'Cache cleared successfully.')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="trash" size={22} color={colors.danger} />
              <Text style={[styles.rowLabel, { color: colors.danger }]}>Clear Cache</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.icon} />
          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() =>
              Alert.alert('Reset', 'This will delete all survey data. Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive' },
              ])
            }
          >
            <View style={styles.rowLeft}>
              <Ionicons name="warning" size={22} color={colors.danger} />
              <Text style={[styles.rowLabel, { color: colors.danger }]}>Reset All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.icon} />
          </Pressable>
        </View>

        {/* About */}
        <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle" size={22} color={colors.info} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Version</Text>
            </View>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>1.0.0</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="code-slash" size={22} color={colors.success} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Built with</Text>
            </View>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>Expo SDK 54</Text>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 4,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  rowValue: {
    fontSize: 14,
  },
});
