import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SurveyProvider } from '@/store/SurveyContext';
import { DrawerProvider } from '@/store/DrawerContext';
import { DrawerSidebar } from '@/components/DrawerSidebar';

export default function RootLayout() {
  return (
    <SurveyProvider>
      <DrawerProvider>
        <DrawerSidebar />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="camera/index" options={{ headerShown: false }} />
          <Stack.Screen name="contacts/index" options={{ headerShown: false }} />
          <Stack.Screen name="location/index" options={{ headerShown: false }} />
          <Stack.Screen name="clipboard/index" options={{ headerShown: false }} />
          <Stack.Screen name="settings/index" options={{ headerShown: false }} />
          <Stack.Screen name="survey/preview" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </DrawerProvider>
    </SurveyProvider>
  );
}
