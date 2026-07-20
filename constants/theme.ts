import { Platform } from 'react-native';

const tintColorLight = '#2563EB';
const tintColorDark = '#60A5FA';

export const Colors = {
  light: {
    text: '#1E293B',
    textSecondary: '#64748B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    border: '#E2E8F0',
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',
    card: '#FFFFFF',
    cardShadow: 'rgba(0,0,0,0.08)',
    overlay: 'rgba(0,0,0,0.5)',
    inputBg: '#F1F5F9',
    priorityLow: '#22C55E',
    priorityMedium: '#F59E0B',
    priorityHigh: '#F97316',
    priorityCritical: '#EF4444',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    border: '#334155',
    danger: '#F87171',
    success: '#4ADE80',
    warning: '#FBBF24',
    info: '#60A5FA',
    card: '#1E293B',
    cardShadow: 'rgba(0,0,0,0.3)',
    overlay: 'rgba(0,0,0,0.7)',
    inputBg: '#334155',
    priorityLow: '#4ADE80',
    priorityMedium: '#FBBF24',
    priorityHigh: '#FB923C',
    priorityCritical: '#F87171',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
