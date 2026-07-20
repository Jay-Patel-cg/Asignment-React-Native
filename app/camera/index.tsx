import React, { useState, useRef } from 'react';
import { View, Text, Image, Pressable, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AppHeader } from '@/components/AppHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Camera" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading camera permissions...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Camera" />
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={64} color={colors.icon} />
          <Text style={[styles.permTitle, { color: colors.text }]}>Camera Permission Required</Text>
          <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
            We need camera access to capture site photos for your surveys.
          </Text>
          <Pressable
            style={[styles.permBtn, { backgroundColor: colors.tint }]}
            onPress={requestPermission}
          >
            <Text style={styles.permBtnText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const now = new Date();
      setCaptureTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ' ' +
          now.toLocaleDateString()
      );
      setPhoto(result.uri);
    } catch {
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPhoto(null);
          setCaptureTime('');
        },
      },
    ]);
  };

  if (photo) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Photo Preview" />
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} resizeMode="cover" />
          <View style={[styles.timeStamp, { backgroundColor: colors.overlay }]}>
            <Ionicons name="time-outline" size={16} color="#FFF" />
            <Text style={styles.timeText}>{captureTime}</Text>
          </View>
        </View>
        <View style={[styles.previewActions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.warning + '20' }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={22} color={colors.danger} />
            <Text style={[styles.actionBtnText, { color: colors.danger }]}>Delete</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.info + '20' }]}
            onPress={() => {
              setPhoto(null);
              setCaptureTime('');
            }}
          >
            <Ionicons name="refresh" size={22} color={colors.info} />
            <Text style={[styles.actionBtnText, { color: colors.info }]}>Retake</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.success + '20' }]}
            onPress={() => {
              Alert.alert('Photo Saved', 'Photo has been saved to the current survey.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            }}
          >
            <Ionicons name="checkmark" size={22} color={colors.success} />
            <Text style={[styles.actionBtnText, { color: colors.success }]}>Use Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.cameraOverlay}>
          <AppHeader title="Camera" subtitle="Capture site photo" />
          <View style={styles.cameraBottom}>
            {loading ? (
              <View style={styles.captureLoading}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.captureLoadingText}>Capturing...</Text>
              </View>
            ) : (
              <Pressable style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.captureBtnInner} />
              </Pressable>
            )}
            <Text style={styles.hint}>Tap to capture</Text>
          </View>
        </View>
      </CameraView>
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraBottom: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  captureLoading: {
    alignItems: 'center',
  },
  captureLoadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  hint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 12,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
  },
  timeStamp: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '600',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
