import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useSurveys } from '@/store/SurveyContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#22C55E',
  Medium: '#F59E0B',
  High: '#F97316',
  Critical: '#EF4444',
};

export default function SurveyPreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { getSurveyById, updateSurvey } = useSurveys();

  const survey = id ? getSurveyById(id) : undefined;
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (survey) {
      setNotes(survey.notes);
      setClientName(survey.clientName);
      setDescription(survey.description);
    }
  }, [survey]);

  if (!survey) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Survey Preview" />
        <View style={styles.center}>
          <Ionicons name="document-outline" size={64} color={colors.icon} />
          <Text style={[styles.notFound, { color: colors.text }]}>Survey not found</Text>
          <Pressable style={[styles.backBtn, { backgroundColor: colors.tint }]} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const priorityColor = PRIORITY_COLORS[survey.priority] || colors.warning;

  const handleSave = () => {
    updateSurvey(survey.id, {
      clientName: clientName.trim(),
      description: description.trim(),
      notes: notes.trim(),
    });
    setEditing(false);
    Alert.alert('Saved', 'Survey updated successfully.');
  };

  const handleSubmit = () => {
    Alert.alert('Submit Survey', 'Submit this survey for review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () => {
          updateSurvey(survey.id, { status: 'submitted', notes: notes.trim() });
          Alert.alert('Submitted', 'Survey has been submitted successfully!', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader
          title="Survey Preview"
          subtitle={survey.id}
          rightIcon={editing ? 'close' : 'create-outline'}
          onRightPress={() => setEditing(!editing)}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          <View
            style={[
              styles.statusBanner,
              {
                backgroundColor:
                  survey.status === 'submitted' ? colors.success + '15' : colors.warning + '15',
              },
            ]}
          >
            <Ionicons
              name={survey.status === 'submitted' ? 'checkmark-circle' : 'time'}
              size={20}
              color={survey.status === 'submitted' ? colors.success : colors.warning}
            />
            <Text
              style={[
                styles.statusText,
                { color: survey.status === 'submitted' ? colors.success : colors.warning },
              ]}
            >
              {survey.status === 'submitted' ? 'Submitted' : 'Draft'}
            </Text>
          </View>

          {/* Photo */}
          {survey.photoUri ? (
            <Image source={{ uri: survey.photoUri }} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="camera-outline" size={40} color={colors.icon} />
              <Text style={[styles.photoText, { color: colors.textSecondary }]}>No photo attached</Text>
            </View>
          )}

          {/* Details Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Site Name */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="map" size={20} color={colors.tint} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Site Name</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{survey.siteName}</Text>
              </View>
            </View>

            {/* Client Name */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="business" size={20} color={colors.success} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Client Name</Text>
                {editing ? (
                  <TextInput
                    style={[styles.editInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={clientName}
                    onChangeText={setClientName}
                  />
                ) : (
                  <Text style={[styles.detailValue, { color: colors.text }]}>{survey.clientName}</Text>
                )}
              </View>
            </View>

            {/* Description */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="document-text" size={20} color={colors.info} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Description</Text>
                {editing ? (
                  <TextInput
                    style={[styles.editInput, styles.editMultiline, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                ) : (
                  <Text style={[styles.detailValue, { color: colors.text }]}>{survey.description}</Text>
                )}
              </View>
            </View>

            {/* Priority */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="flag" size={20} color={priorityColor} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Priority</Text>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
                  <Text style={[styles.priorityText, { color: priorityColor }]}>{survey.priority}</Text>
                </View>
              </View>
            </View>

            {/* Date */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="calendar" size={20} color={colors.warning} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{survey.date}</Text>
              </View>
            </View>

            {/* Contact */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="call" size={20} color="#EC4899" />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Contact</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {survey.contactName || 'Not assigned'}
                  {survey.contactNumber ? ` - ${survey.contactNumber}` : ''}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="location" size={20} color={colors.danger} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Location</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {survey.location
                    ? `${survey.location.latitude.toFixed(4)}, ${survey.location.longitude.toFixed(4)}`
                    : 'No location data'}
                </Text>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.detailRow}>
              <Ionicons name="chatbubble" size={20} color="#8B5CF6" />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Notes</Text>
                {editing ? (
                  <TextInput
                    style={[styles.editInput, styles.editMultiline, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholder="Add notes..."
                    placeholderTextColor={colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {survey.notes || 'No notes'}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {editing ? (
            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => setEditing(false)}
              >
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: colors.tint }]}
                onPress={handleSave}
              >
                <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Save Changes</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              {survey.status !== 'submitted' && (
                <Pressable
                  style={[styles.actionBtn, { backgroundColor: colors.success }]}
                  onPress={handleSubmit}
                >
                  <Ionicons name="send" size={18} color="#FFF" />
                  <Text style={[styles.actionBtnText, { color: '#FFFFFF', marginLeft: 6 }]}>Submit</Text>
                </Pressable>
              )}
            </View>
          )}

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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  notFound: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  backBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 12,
  },
  photoPlaceholder: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photoText: {
    fontSize: 13,
    marginTop: 6,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginTop: 4,
  },
  editMultiline: {
    minHeight: 60,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
