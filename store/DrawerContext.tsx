import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DrawerRoute } from '@/constants/types';

interface DrawerContextType {
  isOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        toggleDrawer: () => setIsOpen((prev) => !prev),
        closeDrawer: () => setIsOpen(false),
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within DrawerProvider');
  return context;
}
