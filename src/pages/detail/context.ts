import { createContext } from 'react';
import { Department } from '@/types';
import { symptomFormState } from '@/state';

// Interface for stats items in the header
interface StatItem {
  label: string;
  value: string | number;
}

// Interface for related items (services or doctors)
interface RelatedItem {
  id: string | number;
  title: string;
  subtitle?: string;
  icon: string;
  link?: string;
}

export interface DetailPageTemplateProps {
  title: string;
  subtitle?: string;
  icon?: string;
  stats?: StatItem[];
  related?: RelatedItem[];
  tab1: {
    htmlContent: string;
  };
  tab2: {
    department: Department;
  };
  tab3: {
    formData: typeof symptomFormState;
  };
}

export const DetailPageContext = createContext({} as DetailPageTemplateProps);
