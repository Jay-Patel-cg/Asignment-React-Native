import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useSurveys } from '@/store/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

export default function CreateSurveyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addSurvey, todayCount } = useSurveys();

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Low': return colors.priorityLow;
      case 'Medium': return colors.priorityMedium;
      case 'High': return colors.priorityHigh;
      case 'Critical': return colors.priorityCritical;
      default: return colors.warning;
    }
  };

  const handleSubmit = () => {
    if (!siteName.trim()) {
      Alert.alert('Validation', 'Site Name is required');
      return;
    }
    if (!clientName.trim()) {
      Alert.alert('Validation', 'Client Name is required');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation', 'Description is required');
      return;
    }

    const newSurvey = addSurvey({
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
      photoUri: null,
      location: null,
      contactName: '',
      contactNumber: '',
      notes: '',
      status: 'draft',
    });

    Alert.alert('Success', `Survey "${newSurvey.id}" created!`, [
      { text: 'View', onPress: () => router.push({ pathname: '/survey/preview', params: { id: newSurvey.id } }) },
      { text: 'OK' },
    ]);

    setSiteName('');
    setClientName('');
    setDescription('');
    setPriority('Medium');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Create Survey" subtitle="Fill in site details" />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Survey Count */}
          <View style={[styles.countBanner, { backgroundColor: colors.tint + '12' }]}>
            <Ionicons name="document-text" size={20} color={colors.tint} />
            <Text style={[styles.countText, { color: colors.tint }]}>
              Surveys created today: {todayCount}
            </Text>
          </View>

          {/* Site Name */}
          <Text style={[styles.label, { color: colors.text }]}>Site Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Enter site name"
            placeholderTextColor={colors.textSecondary}
            value={siteName}
            onChangeText={setSiteName}
          />

          {/* Client Name */}
          <Text style={[styles.label, { color: colors.text }]}>Client Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Enter client name"
            placeholderTextColor={colors.textSecondary}
            value={clientName}
            onChangeText={setClientName}
          />

          {/* Description */}
          <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Describe the survey purpose"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Priority */}
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const isActive = priority === p;
              const pColor = getPriorityColor(p);
              return (
                <Pressable
                  key={p}
                  style={[
                    styles.priorityBtn,
                    {
                      backgroundColor: isActive ? pColor + '20' : colors.inputBg,
                      borderColor: isActive ? pColor : colors.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityBtnText, { color: isActive ? pColor : colors.text }]}>
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Date */}
          <Text style={[styles.label, { color: colors.text }]}>Date</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
            value={date}
            onChangeText={setDate}
          />

          {/* Submit */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: colors.tint },
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.submitText}>Create Survey</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  countBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 100,
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  priorityBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
