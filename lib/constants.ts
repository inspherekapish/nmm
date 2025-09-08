export const ROLES = {
  MENTEE: 'mentee' as const,
  MENTOR: 'mentor' as const,
  SCHOOL_HEAD: 'school-head' as const,
  // REVIEWER: 'reviewer' as const,
  // STATE_ADMIN: 'state-admin' as const,
  // MAIN_ADMIN: 'main-admin' as const,
};

export const ROLE_LABELS = {
  mentee: 'Mentee',
  mentor: 'Mentor',
  'school-head': 'School Head',
  reviewer: 'Reviewer',
  'state-admin': 'State Admin',
  'main-admin': 'Main Admin',
};

export const ROLE_DESCRIPTIONS = {
  mentee: 'Teachers seeking professional development and mentoring support',
  mentor: 'Experienced educators providing guidance and support',
  'school-head': 'School administrators managing teacher development programs',
  reviewer: 'Subject matter experts reviewing mentor applications',
  'state-admin': 'State-level administrators overseeing regional programs',
  'main-admin': 'System administrators with full platform access',
};

export const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal',
];

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Studies',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
  'Arts',
  'Music',
  'Commerce',
  'Economics',
  'History',
  'Geography',
];

export const MENTORING_AREAS = [
  'Classroom Management',
  'Curriculum Development',
  'Assessment Strategies',
  'Technology Integration',
  'Student Engagement',
  'Leadership Development',
  'Professional Development',
  'Special Education',
  'Language Teaching',
  'STEM Education',
  'Art Education',
  'Sports & Physical Education',
];

export const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi'];

export const SCHOOL_TYPES = ['Government', 'Aided', 'Unaided', 'Central Government', 'Private'];
