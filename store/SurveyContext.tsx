import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Survey } from '@/constants/types';

interface SurveyContextType {
  surveys: Survey[];
  addSurvey: (survey: Omit<Survey, 'id' | 'createdAt'>) => Survey;
  updateSurvey: (id: string, updates: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  getSurveyById: (id: string) => Survey | undefined;
  todayCount: number;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const generateId = () => `SURV-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const today = new Date().toISOString().split('T')[0];

const initialSurveys: Survey[] = [
  {
    id: 'SURV-001',
    siteName: 'Downtown Office Complex',
    clientName: 'ABC Corp',
    description: 'Structural inspection of the main building',
    priority: 'High',
    date: today,
    photoUri: null,
    location: { latitude: 40.7128, longitude: -74.006, accuracy: 5 },
    contactName: 'John Smith',
    contactNumber: '+1-555-0101',
    notes: 'Client requested morning visit',
    status: 'submitted',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'SURV-002',
    siteName: 'Riverside Park',
    clientName: 'City Council',
    description: 'Environmental survey for new playground',
    priority: 'Medium',
    date: today,
    photoUri: null,
    location: { latitude: 40.8003, longitude: -73.9712, accuracy: 8 },
    contactName: 'Sarah Johnson',
    contactNumber: '+1-555-0202',
    notes: '',
    status: 'draft',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'SURV-003',
    siteName: 'Industrial Zone B',
    clientName: 'Manufacturing Inc',
    description: 'Safety compliance check',
    priority: 'Critical',
    date: today,
    photoUri: null,
    location: null,
    contactName: 'Mike Brown',
    contactNumber: '',
    notes: 'Urgent - compliance deadline Friday',
    status: 'submitted',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);

  const todayCount = surveys.filter((s) => s.date === today).length;

  const addSurvey = useCallback((data: Omit<Survey, 'id' | 'createdAt'>) => {
    const newSurvey: Survey = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    return newSurvey;
  }, []);

  const updateSurvey = useCallback((id: string, updates: Partial<Survey>) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSurvey = useCallback((id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSurveyById = useCallback(
    (id: string) => surveys.find((s) => s.id === id),
    [surveys]
  );

  return (
    <SurveyContext.Provider
      value={{ surveys, addSurvey, updateSurvey, deleteSurvey, getSurveyById, todayCount }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveys() {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurveys must be used within SurveyProvider');
  return context;
}
