'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MobileSidebar from '@/components/ui/mobile-sidebar';
import IssueForm from '@/components/dashboard/vehicle-owner/issue-form';
import IssueHistory from '@/components/dashboard/vehicle-owner/issue-history';
import ModernAnalyticsDashboard from '@/components/dashboard/service-provider/modern-analytics-dashboard';
import EditProfile from '@/components/dashboard/vehicle-owner/edit-profile';
import FloatingAIAssistant from '@/components/floating-ai-assistant';
import { 
  Car, 
  User, 
  LogOut, 
  Settings, 
  BarChart3, 
  FileText, 
  History, 
  Bell, 
  Search,
  Home,
  Users,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  MessageCircle,
  Plus,
  Bookmark,
  Globe
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      fetchUserProfile();
    }
  }, [session, status, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isVehicleOwner) {
      setActiveTab('overview');
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleProfileSave = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setIsEditingProfile(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-medium text-white">Loading Dashboard...</p>
          <p className="text-gray-400 mt-2">Initializing AI systems...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isVehicleOwner = (session.user as any)?.userType === 'vehicle_owner';
  const isAdmin = (session.user as any)?.userType === 'admin';

  // Redirect admin to admin dashboard
  if (isAdmin) {
    router.push('/admin/dashboard');
    return null;
  }

  const vehicleOwnerTabs = [
    { id: 'report', label: 'Report Issue', icon: <FileText className="w-5 h-5" />, component: IssueForm },
    { id: 'history', label: 'Issue History', icon: <History className="w-5 h-5" />, component: IssueHistory },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, component: null },
  ];

  const serviceProviderTabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'vehicle-models', label: 'Vehicle Models', icon: <Car className="w-5 h-5" /> },
    { id: 'manufacturing', label: 'Manufacturing', icon: <Activity className="w-5 h-5" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'quality', label: 'Quality', icon: <Shield className="w-5 h-5" /> },
    { id: 'geographic', label: 'Geographic', icon: <Globe className="w-5 h-5" /> },
  ];

  const tabs = isVehicleOwner ? vehicleOwnerTabs : serviceProviderTabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,219,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,219,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        userType={isVehicleOwner ? 'vehicle_owner' : 'service_provider'}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={session.user?.name ?? undefined}
      />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 z-30">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Carsor AI
                  </h1>
                  <p className="text-xs text-gray-400">Professional Platform</p>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <Avatar className="w-12 h-12 border-2 border-cyan-400/30">
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{session.user?.name}</p>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-cyan-400/30 text-cyan-300 bg-cyan-500/10 mt-1"
                  >
                    {isVehicleOwner ? 'Vehicle Owner' : 'Service Provider'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-2 px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`transition-colors ${
                      activeTab === tab.id ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'
                    }`}>
                      {tab.icon}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-2xl py-3"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${!isMobile ? 'ml-80' : ''} ${isMobile ? 'pt-20' : ''} relative z-10`}>
        {/* Top Header for Desktop */}
        {!isMobile && (
          <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {isVehicleOwner ? 'Vehicle Dashboard' : 'Analytics Dashboard'}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {isVehicleOwner ? 'Manage your vehicle issues and maintenance' : 'Professional insights and data analytics'}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  </Button>
                  
                  {userProfile && isVehicleOwner && (
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{userProfile.vehicleModel}</h3>
                            <p className="text-sm text-gray-400">{userProfile.vehicleRegistration}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-8">
          {isVehicleOwner ? (
            <div className="space-y-8">
              {activeTab === 'report' && (
                <IssueForm 
                  vehicleModel={userProfile?.vehicleModel || 'Unknown'} 
                  onSubmit={(issue) => {
                    console.log('Issue submitted:', issue);
                  }}
                />
              )}

              {activeTab === 'history' && <IssueHistory />}

              {activeTab === 'profile' && (
                <>
                  {isEditingProfile ? (
                    <EditProfile 
                      userProfile={userProfile}
                      onSave={handleProfileSave}
                      onCancel={() => setIsEditingProfile(false)}
                    />
                  ) : (
                    <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                      <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/10">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-white">Profile Information</span>
                            <p className="text-gray-400 font-normal">Manage your account details</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        {userProfile ? (
                          <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3">
                                  <User className="w-4 h-4 text-cyan-400" />
                                  Full Name
                                </label>
                                <p className="text-xl font-semibold text-white">{userProfile.name}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <label className="text-sm font-semibold text-gray-400 mb-3 block">Email Address</label>
                                <p className="text-xl font-semibold text-white">{userProfile.email}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <label className="text-sm font-semibold text-gray-400 mb-3 block">Phone Number</label>
                                <p className="text-xl font-semibold text-white">{userProfile.phone}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3">
                                  <Car className="w-4 h-4 text-cyan-400" />
                                  Vehicle Model
                                </label>
                                <p className="text-xl font-semibold text-white">{userProfile.vehicleModel}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <label className="text-sm font-semibold text-gray-400 mb-3 block">Manufacturing Year</label>
                                <p className="text-xl font-semibold text-white">{userProfile.vehicleYear}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 lg:col-span-2">
                                <label className="text-sm font-semibold text-gray-400 mb-3 block">Registration Number</label>
                                <p className="text-xl font-semibold text-white">{userProfile.vehicleRegistration}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => setIsEditingProfile(true)}
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-2xl px-8 py-3 text-lg font-semibold"
                            >
                              <Settings className="w-5 h-5 mr-2" />
                              Edit Profile
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-gray-400">Loading profile...</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          ) : (
            <ModernAnalyticsDashboard activeTab={activeTab} />
          )}
        </div>
      </div>
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}
