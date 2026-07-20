export interface Survey {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  photoUri: string | null;
  location: { latitude: number; longitude: number; accuracy: number } | null;
  contactName: string;
  contactNumber: string;
  notes: string;
  status: 'draft' | 'submitted';
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export type DrawerRoute =
  | 'dashboard'
  | 'survey'
  | 'camera'
  | 'contacts'
  | 'location'
  | 'clipboard'
  | 'settings';
