'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image, Video } from 'lucide-react';
import { validateFileSize, validateFileType } from '@/lib/validators';

interface FileUploadProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
  value?: File[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  error,
  hint,
  required,
  accept = '*',
  maxSize = 10,
  multiple = false,
  onFileSelect,
  disabled = false,
  value = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validationErrors: string[] = [];

    // Validate each file
    fileArray.forEach((file, index) => {
      if (!validateFileSize(file, maxSize)) {
        validationErrors.push(`File ${file.name} exceeds ${maxSize}MB size limit`);
      }

      if (accept !== '*') {
        const allowedTypes = accept.split(',').map(type => type.trim());
        if (!validateFileType(file, allowedTypes)) {
          validationErrors.push(`File ${file.name} type not allowed`);
        }
      }
    });

    if (validationErrors.length > 0) {
      setUploadError(validationErrors.join(', '));
      return;
    }

    setUploadError('');
    onFileSelect(multiple ? [...value, ...fileArray] : fileArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (disabled) return;
    
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (indexToRemove: number) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onFileSelect(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
          ${error || uploadError ? 'border-red-500' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Click to upload or drag and drop
        </p>
        {hint && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Max file size: {maxSize}MB
        </p>
      </div>

      {/* Selected Files */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error || uploadError}
        </p>
      )}
    </div>
  );
};