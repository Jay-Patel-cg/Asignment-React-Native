import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { AppHeader } from '@/components/AppHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSurveys } from '@/store/SurveyContext';

export default function ClipboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { surveys } = useSurveys();
  const [pastedText, setPastedText] = useState('');
  const [clipboardContent, setClipboardContent] = useState('');

  const refreshClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setClipboardContent(text || '(empty)');
  };

  useEffect(() => {
    refreshClipboard();
  }, []);

  const copySurveyId = async (id: string) => {
    await Clipboard.setStringAsync(id);
    setClipboardContent(id);
    Alert.alert('Copied!', `Survey ID "${id}" copied to clipboard.`);
  };

  const copyLocation = async () => {
    const text = '40.712800, -74.006000';
    await Clipboard.setStringAsync(text);
    setClipboardContent(text);
    Alert.alert('Copied!', `Location copied: ${text}`);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    setPastedText(text);
    if (text) {
      Alert.alert('Pasted', `Clipboard content:\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
    } else {
      Alert.alert('Empty', 'Clipboard is empty.');
    }
  };

  const handleClear = async () => {
    await Clipboard.setStringAsync('');
    setClipboardContent('');
    setPastedText('');
    Alert.alert('Cleared', 'Clipboard data has been cleared.');
  };

  const latestSurvey = surveys[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Clipboard" subtitle="Copy & paste data" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Current Clipboard */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard" size={20} color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Clipboard Content</Text>
            <Pressable onPress={refreshClipboard}>
              <Ionicons name="refresh" size={18} color={colors.tint} />
            </Pressable>
          </View>
          <View style={[styles.clipboardBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Text style={[styles.clipboardText, { color: colors.textSecondary }]}>
              {clipboardContent || '(empty)'}
            </Text>
          </View>
        </View>

        {/* Quick Copy Actions */}
        <Text style={[styles.groupLabel, { color: colors.text }]}>Quick Copy</Text>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            style={[styles.actionRow, { borderBottomColor: colors.border }]}
            onPress={() => copySurveyId(latestSurvey?.id || 'SURV-001')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.info + '15' }]}>
              <Ionicons name="document-text" size={20} color={colors.info} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Copy Survey ID</Text>
              <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
                {latestSurvey ? latestSurvey.id : 'No surveys yet'}
              </Text>
            </View>
            <Ionicons name="copy-outline" size={20} color={colors.tint} />
          </Pressable>

          <Pressable
            style={[styles.actionRow, { borderBottomColor: colors.border }]}
            onPress={() => {
              const num = latestSurvey?.contactNumber || '+1-555-0101';
              Clipboard.setStringAsync(num);
              setClipboardContent(num);
              Alert.alert('Copied!', `Contact number: ${num}`);
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="call" size={20} color={colors.success} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Copy Contact Number</Text>
              <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
                {latestSurvey?.contactNumber || '+1-555-0101'}
              </Text>
            </View>
            <Ionicons name="copy-outline" size={20} color={colors.tint} />
          </Pressable>

          <Pressable style={styles.actionRow} onPress={copyLocation}>
            <View style={[styles.actionIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="location" size={20} color={colors.warning} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Copy Current Location</Text>
              <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
                40.712800, -74.006000
              </Text>
            </View>
            <Ionicons name="copy-outline" size={20} color={colors.tint} />
          </Pressable>
        </View>

        {/* Paste Notes */}
        <Text style={[styles.groupLabel, { color: colors.text }]}>Paste Notes</Text>
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.notesInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            placeholder="Paste or type notes here..."
            placeholderTextColor={colors.textSecondary}
            value={pastedText}
            onChangeText={setPastedText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <View style={styles.notesActions}>
            <Pressable
              style={[styles.notesBtn, { backgroundColor: colors.tint + '15' }]}
              onPress={handlePaste}
            >
              <Ionicons name="clipboard-outline" size={18} color={colors.tint} />
              <Text style={[styles.notesBtnText, { color: colors.tint }]}>Paste</Text>
            </Pressable>
            <Pressable
              style={[styles.notesBtn, { backgroundColor: colors.danger + '15' }]}
              onPress={handleClear}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[styles.notesBtnText, { color: colors.danger }]}>Clear All</Text>
            </Pressable>
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
    paddingTop: 12,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
  },
  clipboardBox: {
    margin: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 48,
  },
  clipboardText: {
    fontSize: 14,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionDesc: {
    fontSize: 12,
    marginTop: 1,
  },
  notesInput: {
    margin: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 100,
  },
  notesActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  notesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  notesBtnText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
});
