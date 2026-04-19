import React, { createContext, useContext, useState, useEffect } from 'react';
import { DuaType } from '@/config/types';
import defaultDuasJson from '@/assets/data/duas.json';
import defaultCategoriesData from '@/assets/data/categories.json';

interface CMSDataContextType {
  duas: DuaType[];
  categories: any;
  isPreviewMode: boolean;
  selectedDuaId?: number; // ID of dua to focus on
  updatePreviewData: (duas: DuaType[], categories: any, selectedDuaId?: number) => void;
}

const CMSDataContext = createContext<CMSDataContextType | undefined>(undefined);

export const CMSDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [duas, setDuas] = useState<DuaType[]>(defaultDuasJson);
  const [categories, setCategories] = useState(defaultCategoriesData);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedDuaId, setSelectedDuaId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Set up postMessage listener for CMS updates
    const handleMessage = (event: MessageEvent) => {
      // In production, verify origin: event.origin === 'http://localhost:3000'
      if (event.data?.type === 'MANASIK_DATA_UPDATE') {
        console.log('handleMessage!', event.data.type, event.data.payload)
        const { duas: newDuas, categories: newCategories, selectedDuaId: newSelectedDuaId } = event.data.payload;
        if (newDuas && newCategories) {
          setDuas(newDuas);
          setCategories(newCategories);
          setSelectedDuaId(newSelectedDuaId);
          setIsPreviewMode(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const updatePreviewData = (newDuas: DuaType[], newCategories: any, newSelectedDuaId?: number) => {
    setDuas(newDuas);
    setCategories(newCategories);
    setSelectedDuaId(newSelectedDuaId);
    setIsPreviewMode(true);
  };

  return (
    <CMSDataContext.Provider value={{ duas, categories, isPreviewMode, selectedDuaId, updatePreviewData }}>
      {children}
    </CMSDataContext.Provider>
  );
};

export const useCMSData = () => {
  const context = useContext(CMSDataContext);
  if (!context) {
    throw new Error('useCMSData must be used within a CMSDataProvider');
  }
  return context;
};

