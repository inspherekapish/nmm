'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { FileUpload } from '@/components/forms/FileUpload';
import { registerUser } from '@/lib/mockApi';
import { RegisterFormData, UserRole } from '@/lib/types';
import { ROLES, ROLE_LABELS, STATES, SUBJECTS, MENTORING_AREAS, SCHOOL_TYPES } from '@/lib/constants';
import { validateRegistrationForm, ValidationError } from '@/lib/validators';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    role: '' as UserRole,
    name: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    mobile: '',
    address: {
      state: '',
      district: '',
      block: '',
      village: '',
      pincode: ''
    }
  });

  const [files, setFiles] = useState<Record<string, File[]>>({
    photo: [],
    govtId: [],
    caseStudy: [],
    videoTestimonial: [],
    supportingDocuments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const roleOptions = Object.values(ROLES).map(role => ({
    value: role,
    label: ROLE_LABELS[role]
  }));

  const stateOptions = STATES.map(state => ({
    value: state,
    label: state
  }));

  const subjectOptions = SUBJECTS.map(subject => ({
    value: subject,
    label: subject
  }));

  const mentoringAreaOptions = MENTORING_AREAS.map(area => ({
    value: area,
    label: area
  }));

  const schoolTypeOptions = SCHOOL_TYPES.map(type => ({
    value: type,
    label: type
  }));

  const genderOptions = [
    { value: 'Male', label: t('form.male') },
    { value: 'Female', label: t('form.female') },
    { value: 'Other', label: t('form.other') }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileSelect = (field: string, selectedFiles: File[]) => {
    setFiles(prev => ({
      ...prev,
      [field]: selectedFiles
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegistrationForm(formData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Add photo file to form data
      const formDataWithPhoto = {
        ...formData,
        photo: files.photo[0]
      };

      await registerUser(formDataWithPhoto);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your registration has been submitted successfully. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium block"
              >
                Login to Your Account
              </Link>
              <Link
                href="/"
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium block"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.registerTitle')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <Select
              label={t('auth.role')}
              options={roleOptions}
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
              error={errors.role}
              placeholder="Select your role"
              required
            />

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('form.name')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
              />

              <Input
                label={t('form.dateOfBirth')}
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label={t('form.gender')}
                options={genderOptions}
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                error={errors.gender}
                required
              />

              <FileUpload
                label={t('form.photo')}
                accept="image/*"
                maxSize={2}
                onFileSelect={(files) => handleFileSelect('photo', files)}
                error={errors.photo}
                value={files.photo}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('auth.email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label={t('auth.mobile')}
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                error={errors.mobile}
                required
              />
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('form.address')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label={t('form.state')}
                  options={stateOptions}
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  error={errors['address.state']}
                  placeholder="Select state"
                  required
                />

                <Input
                  label={t('form.district')}
                  value={formData.address.district}
                  onChange={(e) => handleInputChange('address.district', e.target.value)}
                  error={errors['address.district']}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <Input
                  label={t('form.block')}
                  value={formData.address.block}
                  onChange={(e) => handleInputChange('address.block', e.target.value)}
                  error={errors['address.block']}
                />

                <Input
                  label={t('form.village')}
                  value={formData.address.village}
                  onChange={(e) => handleInputChange('address.village', e.target.value)}
                  error={errors['address.village']}
                />

                <Input
                  label={t('form.pincode')}
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                  error={errors['address.pincode']}
                  required
                />
              </div>
            </div>

            {/* Role-specific Fields */}
            {formData.role === 'mentee' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Mentee Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('form.academicQualification')}
                      value={formData.academicQualification || ''}
                      onChange={(e) => handleInputChange('academicQualification', e.target.value)}
                      error={errors.academicQualification}
                      required
                    />

                    <Input
                      label={t('form.yearsOfExperience')}
                      type="number"
                      value={formData.yearsOfExperience || ''}
                      onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value))}
                      error={errors.yearsOfExperience}
                    />
                  </div>

                  <Input
                    label={t('form.schoolName')}
                    value={formData.schoolName || ''}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    error={errors.schoolName}
                    required
                  />
                </div>
              </div>
            )}

            {formData.role === 'mentor' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Mentor Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('form.designation')}
                      value={formData.designation || ''}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      error={errors.designation}
                      required
                    />

                    <Input
                      label={t('form.professionalExperience')}
                      type="number"
                      value={formData.professionalExperience || ''}
                      onChange={(e) => handleInputChange('professionalExperience', parseInt(e.target.value))}
                      error={errors.professionalExperience}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('form.currentWorkStatus')}
                      value={formData.currentWorkStatus || ''}
                      onChange={(e) => handleInputChange('currentWorkStatus', e.target.value)}
                      error={errors.currentWorkStatus}
                    />

                    <Input
                      label={t('form.lastOrganization')}
                      value={formData.lastOrganization || ''}
                      onChange={(e) => handleInputChange('lastOrganization', e.target.value)}
                      error={errors.lastOrganization}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'school-head' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  School Head Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('form.designation')}
                      value={formData.designation || ''}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      error={errors.designation}
                      required
                    />

                    <Select
                      label={t('form.schoolType')}
                      options={schoolTypeOptions}
                      value={formData.schoolType || ''}
                      onChange={(e) => handleInputChange('schoolType', e.target.value)}
                      error={errors.schoolType}
                      placeholder="Select school type"
                    />
                  </div>

                  <Input
                    label={t('form.schoolName')}
                    value={formData.schoolName || ''}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    error={errors.schoolName}
                    required
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {errors.submit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('common.register')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}