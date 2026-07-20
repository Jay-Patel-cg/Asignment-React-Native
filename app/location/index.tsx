import React, { useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { AppHeader } from '@/components/AppHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function LocationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is needed to use this feature.');
    }
    return status === 'granted';
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      const granted = hasPermission ?? (await requestPermission());
      if (!granted) {
        setLoading(false);
        return;
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy ?? 0,
      });
    } catch {
      Alert.alert('Error', 'Failed to get location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLocation = async () => {
    if (!location) return;
    const text = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `Location copied to clipboard:\n${text}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Location" subtitle="Get current coordinates" />

      <View style={styles.content}>
        {/* Map placeholder */}
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="map-outline" size={64} color={colors.icon} />
          <Text style={[styles.mapText, { color: colors.textSecondary }]}>
            {location ? 'Location acquired' : 'Tap button to get location'}
          </Text>
        </View>

        {/* Location Data */}
        {location && (
          <View style={[styles.dataCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.dataRow, { borderBottomColor: colors.border }]}>
              <View style={styles.dataIcon}>
                <Ionicons name="locate" size={20} color={colors.info} />
              </View>
              <View style={styles.dataContent}>
                <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>Latitude</Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {location.latitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={[styles.dataRow, { borderBottomColor: colors.border }]}>
              <View style={styles.dataIcon}>
                <Ionicons name="locate" size={20} color={colors.success} />
              </View>
              <View style={styles.dataContent}>
                <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>Longitude</Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <View style={styles.dataIcon}>
                <Ionicons name="radio" size={20} color={colors.warning} />
              </View>
              <View style={styles.dataContent}>
                <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>Accuracy</Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {location.accuracy.toFixed(1)} meters
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.tint },
              pressed && { opacity: 0.85 },
            ]}
            onPress={getLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="navigate" size={20} color="#FFF" />
            )}
            <Text style={styles.primaryBtnText}>
              {loading ? 'Getting Location...' : location ? 'Refresh Location' : 'Get Location'}
            </Text>
          </Pressable>
        </View>

        {location && (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              { backgroundColor: colors.success + '15', borderColor: colors.success },
              pressed && { opacity: 0.85 },
            ]}
            onPress={copyLocation}
          >
            <Ionicons name="copy" size={20} color={colors.success} />
            <Text style={[styles.secondaryBtnText, { color: colors.success }]}>
              Copy Location to Clipboard
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 14,
    marginTop: 8,
  },
  dataCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    overflow: 'hidden',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataContent: {
    marginLeft: 12,
  },
  dataLabel: {
    fontSize: 12,
  },
  dataValue: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 1,
  },
  buttonRow: {
    marginTop: 20,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});
