import { User, Mentee, Mentor, SchoolHead, Session, Resource, Feedback, AuthState, RegisterFormData, UserRole } from './types';

// Mock data storage (in real app, this would be backend calls)
let mockUsers: User[] = [
  {
    id: '1',
    email: 'mentee@example.com',
    mobile: '9876543210',
    name: 'Priya Sharma',
    role: 'mentee',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    isActive: true,
    createdAt: '2024-01-01',
    address: {
      state: 'Delhi',
      district: 'Central Delhi',
      block: 'Connaught Place',
      village: '',
      pincode: '110001'
    }
  },
  {
    id: '2',
    email: 'mentor@example.com',
    mobile: '9876543211',
    name: 'Dr. Rajesh Kumar',
    role: 'mentor',
    dateOfBirth: '1980-03-20',
    gender: 'Male',
    isActive: true,
    createdAt: '2024-01-01',
    address: {
      state: 'Maharashtra',
      district: 'Mumbai',
      block: 'Andheri',
      village: '',
      pincode: '400001'
    }
  }
];

let mockSessions: Session[] = [
  {
    id: '1',
    title: 'Effective Classroom Management Strategies',
    description: 'Learn proven techniques for maintaining discipline and engagement',
    mentorId: '2',
    mentorName: 'Dr. Rajesh Kumar',
    area: 'Classroom Management',
    dateTime: '2024-12-25T10:00:00Z',
    language: 'English',
    status: 'upcoming',
    attendees: ['1'],
    resources: []
  }
];

let mockResources: Resource[] = [
  {
    id: '1',
    title: 'Classroom Management Guide',
    description: 'Comprehensive guide for effective classroom management',
    type: 'pdf',
    url: '/mock-resources/classroom-guide.pdf',
    uploadedBy: '2',
    uploadedAt: '2024-12-20T10:00:00Z',
    category: 'Teaching Strategies'
  }
];

// Auth functions
export const loginUser = async (email: string, password: string, role: UserRole): Promise<AuthState> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email && u.role === role);
  
  if (!user) {
    throw new Error('Invalid credentials or role');
  }

  return {
    user,
    isAuthenticated: true,
    role: user.role
  };
};

export const registerUser = async (formData: RegisterFormData): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === formData.email || u.mobile === formData.mobile);
  if (existingUser) {
    throw new Error('User already exists with this email or mobile');
  }

  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email: formData.email,
    mobile: formData.mobile,
    name: formData.name,
    role: formData.role,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender,
    photo: formData.photo ? URL.createObjectURL(formData.photo) : undefined,
    address: formData.address,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  mockUsers.push(newUser);
  return newUser;
};

// Session functions
export const getUserSessions = async (userId: string, role: UserRole): Promise<Session[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (role === 'mentee') {
    return mockSessions.filter(session => session.attendees.includes(userId));
  } else if (role === 'mentor') {
    return mockSessions.filter(session => session.mentorId === userId);
  }
  
  return mockSessions;
};

export const createSession = async (sessionData: Partial<Session>): Promise<Session> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newSession: Session = {
    id: (mockSessions.length + 1).toString(),
    title: sessionData.title || '',
    description: sessionData.description || '',
    mentorId: sessionData.mentorId || '',
    mentorName: sessionData.mentorName || '',
    area: sessionData.area || '',
    dateTime: sessionData.dateTime || new Date().toISOString(),
    language: sessionData.language || 'English',
    status: 'upcoming',
    attendees: [],
    resources: sessionData.resources || []
  };

  mockSessions.push(newSession);
  return newSession;
};

// Resource functions
export const getResources = async (category?: string): Promise<Resource[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (category) {
    return mockResources.filter(resource => resource.category === category);
  }
  
  return mockResources;
};

export const uploadResource = async (resourceData: Partial<Resource>, file: File): Promise<Resource> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const newResource: Resource = {
    id: (mockResources.length + 1).toString(),
    title: resourceData.title || file.name,
    description: resourceData.description || '',
    type: file.type.includes('pdf') ? 'pdf' : file.type.includes('video') ? 'video' : 'doc',
    url: URL.createObjectURL(file),
    uploadedBy: resourceData.uploadedBy || '',
    uploadedAt: new Date().toISOString(),
    category: resourceData.category || 'General'
  };

  mockResources.push(newResource);
  return newResource;
};

// Dashboard stats
export const getDashboardStats = async (userId: string, role: UserRole) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  switch (role) {
    case 'mentee':
      return {
        mentoringHours: 45,
        sessionsAttended: 12,
        upcomingSessions: 3,
        completedSessions: 9
      };
    case 'mentor':
      return {
        sessionsCreated: 28,
        activeMentees: 15,
        averageRating: 4.7,
        totalHours: 120
      };
    case 'school-head':
      return {
        teachersManaged: 25,
        sessionsOrganized: 8,
        attendanceRate: 0.89,
        activePrograms: 4
      };
    default:
      return {};
  }
};

// Export CSV functionality
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};