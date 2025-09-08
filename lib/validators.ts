export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.includes(type));
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateRegistrationForm = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Common validations
  if (!validateRequired(data.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!validateRequired(data.email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!validateRequired(data.mobile)) {
    errors.push({ field: 'mobile', message: 'Mobile number is required' });
  } else if (!validateMobile(data.mobile)) {
    errors.push({ field: 'mobile', message: 'Invalid mobile number format' });
  }

  if (!validateRequired(data.dateOfBirth)) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
  }

  if (!validateRequired(data.gender)) {
    errors.push({ field: 'gender', message: 'Gender is required' });
  }

  if (!validateRequired(data.role)) {
    errors.push({ field: 'role', message: 'Role is required' });
  }

  // Address validations
  if (!validateRequired(data.address?.state)) {
    errors.push({ field: 'address.state', message: 'State is required' });
  }

  if (!validateRequired(data.address?.district)) {
    errors.push({ field: 'address.district', message: 'District is required' });
  }

  if (!validateRequired(data.address?.pincode)) {
    errors.push({ field: 'address.pincode', message: 'Pincode is required' });
  }

  // Role-specific validations
  if (data.role === 'mentee') {
    if (!validateRequired(data.academicQualification)) {
      errors.push({ field: 'academicQualification', message: 'Academic qualification is required' });
    }
    if (!validateRequired(data.schoolName)) {
      errors.push({ field: 'schoolName', message: 'School name is required' });
    }
  }

  if (data.role === 'mentor') {
    if (!validateRequired(data.designation)) {
      errors.push({ field: 'designation', message: 'Designation is required' });
    }
    if (!validateRequired(data.professionalExperience)) {
      errors.push({ field: 'professionalExperience', message: 'Professional experience is required' });
    }
  }

  if (data.role === 'school-head') {
    if (!validateRequired(data.designation)) {
      errors.push({ field: 'designation', message: 'Designation is required' });
    }
    if (!validateRequired(data.schoolName)) {
      errors.push({ field: 'schoolName', message: 'School name is required' });
    }
  }

  return errors;
};