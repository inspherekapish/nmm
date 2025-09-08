'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatCard } from '@/components/cards/StatCard';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { FileUpload } from '@/components/forms/FileUpload';
import { getDashboardStats, createSession } from '@/lib/mockApi';
import { Session } from '@/lib/types';
import { MENTORING_AREAS, LANGUAGES } from '@/lib/constants';
import {
  Users,
  Calendar,
  Star,
  Clock,
  Plus,
  Upload,
  BookOpen,
  CheckCircle,
  X
} from 'lucide-react';

export default function MentorDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>({});
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    area: '',
    dateTime: '',
    language: 'English',
    resources: [] as File[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await getDashboardStats(user!.id, 'mentor');
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingSession(true);

    try {
      await createSession({
        ...sessionForm,
        mentorId: user!.id,
        mentorName: user!.name,
        resources: []
      });

      // Reset form and close modal
      setSessionForm({
        title: '',
        description: '',
        area: '',
        dateTime: '',
        language: 'English',
        resources: []
      });
      setShowCreateSession(false);

      // Reload dashboard data
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const areaOptions = MENTORING_AREAS.map(area => ({
    value: area,
    label: area
  }));

  const languageOptions = LANGUAGES.map(lang => ({
    value: lang,
    label: lang
  }));

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard.welcome')}, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your mentoring sessions and help teachers grow
          </p>
        </div>
        <button
          onClick={() => setShowCreateSession(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Session
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Sessions Created"
          value={stats.sessionsCreated || 0}
          icon={Calendar}
          color="blue"
          description="Total sessions organized"
        />
        <StatCard
          title="Active Mentees"
          value={stats.activeMentees || 0}
          icon={Users}
          color="green"
          description="Currently mentoring"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating || 0}
          icon={Star}
          color="orange"
          description="Out of 5.0"
        />
        <StatCard
          title="Total Hours"
          value={stats.totalHours || 0}
          icon={Clock}
          color="purple"
          description="Mentoring time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upcoming Sessions
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming sessions scheduled
                </p>
                <button
                  onClick={() => setShowCreateSession(true)}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Schedule your first session
                </button>
              </div>
            </div>
          </div>

          {/* Mentee Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mentee Requests
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No pending requests
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dashboard.quickActions')}
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreateSession(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Session
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resources
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center">
                <Star className="h-4 w-4 mr-2" />
                View Feedback
              </button>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Feedback
            </h3>
            <div className="space-y-4">
              {[
                { mentee: 'Priya Sharma', rating: 5, comment: 'Excellent session on classroom management!' },
                { mentee: 'Rajesh Kumar', rating: 4, comment: 'Very helpful teaching strategies.' }
              ].map((feedback, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {feedback.mentee}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < feedback.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feedback.comment}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All Feedback
            </button>
          </div>

          {/* My Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              My Resources
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Teaching Best Practices.pdf', uploads: 45 },
                { name: 'Assessment Strategies.pptx', uploads: 23 },
                { name: 'Classroom Activities.docx', uploads: 67 }
              ].map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {resource.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {resource.uploads} downloads
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Resource
            </button>
          </div>
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Mentoring Session
              </h3>
              <button
                onClick={() => setShowCreateSession(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="p-6 space-y-6">
              <Input
                label="Session Title"
                value={sessionForm.title}
                onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                placeholder="Enter session title"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what the session will cover"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Mentoring Area"
                  options={areaOptions}
                  value={sessionForm.area}
                  onChange={(e) => setSessionForm({ ...sessionForm, area: e.target.value })}
                  placeholder="Select area"
                  required
                />

                <Select
                  label="Language"
                  options={languageOptions}
                  value={sessionForm.language}
                  onChange={(e) => setSessionForm({ ...sessionForm, language: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Date & Time"
                type="datetime-local"
                value={sessionForm.dateTime}
                onChange={(e) => setSessionForm({ ...sessionForm, dateTime: e.target.value })}
                required
              />

              <FileUpload
                label="Session Resources (Optional)"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.avi,.mov"
                maxSize={50}
                multiple
                onFileSelect={(files) => setSessionForm({ ...sessionForm, resources: files })}
                value={sessionForm.resources}
                hint="Upload materials that will help during the session"
              />

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateSession(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSession}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isCreatingSession ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}