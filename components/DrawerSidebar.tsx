import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useDrawer } from '@/store/DrawerContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DRAWER_ITEMS = [
  { route: '/(tabs)', label: 'Dashboard', icon: 'home-outline' as const },
  { route: '/(tabs)/new-survey', label: 'New Survey', icon: 'document-text-outline' as const },
  { route: '/camera', label: 'Camera', icon: 'camera-outline' as const },
  { route: '/contacts', label: 'Contacts', icon: 'people-outline' as const },
  { route: '/location', label: 'Location', icon: 'location-outline' as const },
  { route: '/clipboard', label: 'Clipboard', icon: 'clipboard-outline' as const },
  { route: '/settings', label: 'Settings', icon: 'settings-outline' as const },
];

export function DrawerSidebar() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOpen ? 0 : -300,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [isOpen, slideAnim]);

  if (!isOpen) return null;

  return (
    <>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={closeDrawer} />
      <Animated.View
        style={[
          styles.sidebar,
          { backgroundColor: colors.surface, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Ionicons name="compass-outline" size={32} color={colors.tint} />
          <Text style={[styles.appName, { color: colors.text }]}>Smart Survey</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Field Inspection App</Text>
        </View>

        <View style={styles.menuItems}>
          {DRAWER_ITEMS.map((item) => {
            const isActive =
              pathname === item.route || pathname.startsWith(item.route + '/');
            return (
              <Pressable
                key={item.route}
                style={[
                  styles.menuItem,
                  isActive && { backgroundColor: colors.tint + '15' },
                ]}
                onPress={() => {
                  closeDrawer();
                  router.push(item.route as any);
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? colors.tint : colors.icon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    { color: isActive ? colors.tint : colors.text },
                    isActive && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.tint }]} />}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.version, { color: colors.textSecondary }]}>v1.0.0</Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 101,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    borderRadius: 12,
    position: 'relative',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 16,
  },
  menuLabelActive: {
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
    width: 3,
    height: 24,
    borderRadius: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
  },
});
