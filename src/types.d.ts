export interface Service {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  department: Department;
}

export interface User {
  userInfo: {
    name: string;
    avatar: string;
    id?: string;
    phone?: string;
  };
}

interface TimeSlot {
  date: Date;
}

interface AvailableTimeSlots {
  date: Date;
  slots: { hour: number; half?: boolean; isAvailable?: boolean }[]; // Keeping this for backward compatibility
}

interface Doctor {
  id: number;
  name: string;
  title: string;
  languages: string;
  specialties: string;
  image: string;
  isAvailable: boolean;
}

export interface SymptomDescription {
  symptoms: string[];
  description: string;
  images: string[];
}

export interface Inquiry extends SymptomDescription {
  department?: Department;
}

export interface Feedback {
  title: string;
  description: string;
  images: string[];
  category: string;
}

export interface Booking {
  id: number;
  status: string;
  patientName: string;
  schedule: TimeSlot;
  doctor: Doctor;
  department: Department;
}

export interface Invoice {
  id: number;
  booking: Booking;
}

export interface DepartmentGroup {
  id: number;
  name: string;
  description: string;
}

interface Articles {
  posts: Article[];
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    posts_per_page: number;
    total_pages: number;
    total_posts: number;
  };
}

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  categories: string[];
  featured_image: string;
}

interface Departments {
  posts: Department[];
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    posts_per_page: number;
    total_pages: number;
    total_posts: number;
  };
}

interface Department {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  categories: string[];
  featured_image: string;
}

interface Pagination {
  current_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  posts_per_page: number;
  total_pages: number;
  total_posts: number;
}
