'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatCard } from '@/components/cards/StatCard';
import { getDashboardStats, getUserSessions } from '@/lib/mockApi';
import { Session } from '@/lib/types';
import { 
  Clock, 
  BookOpen, 
  Calendar, 
  CheckCircle,
  Download,
  FileText,
  Video,
  Star
} from 'lucide-react';

export default function MenteeDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'requested'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, userSessions] = await Promise.all([
        getDashboardStats(user!.id, 'mentee'),
        getUserSessions(user!.id, 'mentee')
      ]);
      
      setStats(dashboardStats);
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    switch (activeTab) {
      case 'upcoming':
        return session.status === 'upcoming';
      case 'completed':
        return session.status === 'completed';
      case 'requested':
        return session.status === 'requested';
      default:
        return true;
    }
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.welcome')}, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your mentoring journey and access learning resources
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Mentoring Hours"
          value={stats.mentoringHours || 0}
          icon={Clock}
          color="blue"
          description="Total hours completed"
        />
        <StatCard
          title="Sessions Attended"
          value={stats.sessionsAttended || 0}
          icon={CheckCircle}
          color="green"
          description="Successfully completed"
        />
        <StatCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions || 0}
          icon={Calendar}
          color="purple"
          description="Scheduled for this week"
        />
        <StatCard
          title="Resources Accessed"
          value={42}
          icon={BookOpen}
          color="orange"
          description="Learning materials"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sessions Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                My Sessions
              </h2>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['upcoming', 'completed', 'requested'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {filteredSessions.length > 0 ? (
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {session.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {session.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Mentor: {session.mentorName}</span>
                            <span>Area: {session.area}</span>
                            <span>Language: {session.language}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(session.dateTime).toLocaleDateString()} at{' '}
                            {new Date(session.dateTime).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            session.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                      
                      {session.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            Rate Session
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No {activeTab} sessions found
                  </p>
                </div>
              )}
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
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Request Mentoring Session
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Browse Mentors
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Update Profile
              </button>
            </div>
          </div>

          {/* E-Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Resources
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Classroom Management Guide', type: 'pdf' },
                { name: 'Teaching Strategies Video', type: 'video' },
                { name: 'Assessment Methods', type: 'doc' }
              ].map((resource, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                  {resource.type === 'pdf' ? (
                    <FileText className="h-5 w-5 text-red-500" />
                  ) : resource.type === 'video' ? (
                    <Video className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {resource.name}
                    </p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All Resources
            </button>
          </div>

          {/* Reflection Journal */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reflection Journal
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Document your learning journey and insights
            </p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium">
              Add New Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}