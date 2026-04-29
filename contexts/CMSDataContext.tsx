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
      if (event.data?.type === 'MANASIK_DATA_UPDATE') {
        const { duas: newDuas, categories: newCategories, selectedDuaId: newSelectedDuaId } = event.data.payload;
        if (newDuas && newCategories) {
          setDuas(newDuas);
          setCategories(newCategories);
          setSelectedDuaId(newSelectedDuaId);
          setIsPreviewMode(true);
        }
      }
    };

    if (window && window.addEventListener) {
      window?.addEventListener('message', handleMessage);
      return () => window?.removeEventListener('message', handleMessage);
    }
    return () => {};
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

