'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { getResources } from '@/lib/mockApi';
import { Resource } from '@/lib/types';
import { 
  BookOpen, 
  Search, 
  Filter,
  Download,
  FileText,
  Video,
  Image,
  Eye
} from 'lucide-react';

const categories = [
  'All Categories',
  'Teaching Strategies',
  'Classroom Management',
  'Assessment Methods',
  'Technology Integration',
  'Professional Development',
  'Subject-Specific',
  'Special Education'
];

const resourceTypes = [
  'All Types',
  'PDF Documents',
  'Video Tutorials',
  'Presentations',
  'Interactive Content'
];

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory, selectedType]);

  const loadResources = async () => {
    try {
      const data = await getResources();
      // Add mock resources for demo
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Effective Classroom Management Strategies',
          description: 'Comprehensive guide covering proven techniques for maintaining discipline and engagement in the classroom.',
          type: 'pdf',
          url: '/mock-resources/classroom-management.pdf',
          uploadedBy: 'Dr. Sarah Johnson',
          uploadedAt: '2024-12-20T10:00:00Z',
          category: 'Classroom Management'
        },
        {
          id: '2',
          title: 'Interactive Teaching Methods Video Series',
          description: 'A collection of videos demonstrating various interactive teaching methods to boost student participation.',
          type: 'video',
          url: '/mock-resources/interactive-teaching.mp4',
          uploadedBy: 'Prof. Michael Chen',
          uploadedAt: '2024-12-19T14:30:00Z',
          category: 'Teaching Strategies'
        },
        {
          id: '3',
          title: 'Assessment Techniques Presentation',
          description: 'Slide deck covering modern assessment methods including formative and summative evaluation strategies.',
          type: 'ppt',
          url: '/mock-resources/assessment-techniques.pptx',
          uploadedBy: 'Dr. Emily Rodriguez',
          uploadedAt: '2024-12-18T09:15:00Z',
          category: 'Assessment Methods'
        },
        {
          id: '4',
          title: 'Technology Integration in Education',
          description: 'Best practices for incorporating digital tools and platforms into teaching methodologies.',
          type: 'pdf',
          url: '/mock-resources/tech-integration.pdf',
          uploadedBy: 'James Wilson',
          uploadedAt: '2024-12-17T16:45:00Z',
          category: 'Technology Integration'
        },
        {
          id: '5',
          title: 'Professional Development Planning Guide',
          description: 'Step-by-step guide for creating effective professional development plans for educators.',
          type: 'doc',
          url: '/mock-resources/prof-dev-guide.docx',
          uploadedBy: 'Dr. Lisa Thompson',
          uploadedAt: '2024-12-16T11:20:00Z',
          category: 'Professional Development'
        },
        {
          id: '6',
          title: 'STEM Education Best Practices',
          description: 'Research-based approaches to teaching Science, Technology, Engineering, and Mathematics effectively.',
          type: 'pdf',
          url: '/mock-resources/stem-practices.pdf',
          uploadedBy: 'Prof. David Kumar',
          uploadedAt: '2024-12-15T13:00:00Z',
          category: 'Subject-Specific'
        }
      ];
      
      setResources([...data, ...mockResources]);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== 'All Types') {
      const typeMap: Record<string, string[]> = {
        'PDF Documents': ['pdf'],
        'Video Tutorials': ['video'],
        'Presentations': ['ppt'],
        'Interactive Content': ['doc']
      };
      
      const types = typeMap[selectedType] || [];
      if (types.length > 0) {
        filtered = filtered.filter(resource => types.includes(resource.type));
      }
    }

    setFilteredResources(filtered);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-blue-500" />;
      case 'ppt':
        return <Image className="h-6 w-6 text-orange-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleDownload = (resource: Resource) => {
    // In a real application, this would trigger an actual download
    console.log(`Downloading resource: ${resource.title}`);
    // For demo purposes, we'll just show an alert
    alert(`Downloaded: ${resource.title}`);
  };

  const handlePreview = (resource: Resource) => {
    // In a real application, this would open a preview modal or new tab
    console.log(`Previewing resource: ${resource.title}`);
    alert(`Preview not available in demo mode`);
  };

  const categoryOptions = categories.map(category => ({
    value: category,
    label: category
  }));

  const typeOptions = resourceTypes.map(type => ({
    value: type,
    label: type
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              E-Resources Library
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Access comprehensive educational materials, guides, and tutorials
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="Filter by category"
          />
          
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            placeholder="Filter by type"
          />
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
              setSelectedType('All Types');
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading resources...</span>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start space-x-3 mb-4">
                {getResourceIcon(resource.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {resource.category}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>By {resource.uploadedBy}</span>
                <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handlePreview(resource)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => handleDownload(resource)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No resources found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {resources.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Resources</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              12
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Categories</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              45+
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Contributors</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              1.2K
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Downloads This Month</p>
          </div>
        </div>
      </div>
    </div>
  );
}