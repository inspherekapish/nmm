// Core types for the NMM portal
export type UserRole = 'mentee' | 'mentor' | 'school-head' | 'reviewer' | 'state-admin' | 'main-admin';

export interface User {
  id: string;
  email: string;
  mobile: string;
  name: string;
  role: UserRole;
  dateOfBirth?: string;
  gender?: string;
  photo?: string;
  address?: Address;
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  state: string;
  district: string;
  block?: string;
  village?: string;
  pincode: string;
}

export interface Mentee extends User {
  role: 'mentee';
  academicQualification: string;
  yearsOfExperience: number;
  schoolName: string;
  classesTaught: string[];
  subjects: string[];
  currentLevel: string;
  govtId?: string;
  languagePreferences: string[];
  areasOfMentoring: string[];
  mentoringHours: number;
  sessionsAttended: number;
}

export interface Mentor extends User {
  role: 'mentor';
  designation: string;
  areasOfMentoring: string[];
  professionalExperience: number;
  currentWorkStatus: string;
  lastOrganization: string;
  govtId?: string;
  caseStudy?: string;
  videoTestimonial?: string;
  supportingDocuments?: string[];
  sessionsCreated: number;
  averageRating: number;
}

export interface SchoolHead extends User {
  role: 'school-head';
  designation: string;
  schoolName: string;
  schoolType: string;
  teachersManaged: number;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  area: string;
  dateTime: string;
  language: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'requested';
  attendees: string[];
  resources?: Resource[];
  feedback?: Feedback[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'ppt' | 'video' | 'doc';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number;
  comments: string;
  submittedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface RegisterFormData {
  role: UserRole;
  name: string;
  dateOfBirth: string;
  gender: string;
  photo?: File;
  email: string;
  mobile: string;
  address: Address;
  // Role-specific fields
  academicQualification?: string;
  yearsOfExperience?: number;
  schoolName?: string;
  classesTaught?: string[];
  subjects?: string[];
  currentLevel?: string;
  designation?: string;
  areasOfMentoring?: string[];
  professionalExperience?: number;
  currentWorkStatus?: string;
  lastOrganization?: string;
  schoolType?: string;
}
