'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MobileSidebar from '@/components/ui/mobile-sidebar';
import IssueForm from '@/components/dashboard/vehicle-owner/issue-form';
import IssueHistory from '@/components/dashboard/vehicle-owner/issue-history';
import ModernAnalyticsDashboard from '@/components/dashboard/service-provider/modern-analytics-dashboard';
import EditProfile from '@/components/dashboard/vehicle-owner/edit-profile';
import FloatingAIAssistant from '@/components/floating-ai-assistant';
import { Car, User, LogOut, Settings, BarChart3, FileText, History, Bell } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Dashboard...</p>
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

  return (
    <div className="min-h-screen futuristic-bg">
      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebar
          userType={isVehicleOwner ? 'vehicle_owner' : 'service_provider'}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userName={session.user?.name ?? undefined}

        />
      )}

      {/* Header */}
      <div className="neo-glass shadow-xl border-b border-cyan-400/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-xl quantum-glow">
                  <Car className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-cyan-400 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold holographic-text">
                  Carsor AI
                </h1>
                <p className="text-sm text-white/60 font-medium">Professional Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-white/10 text-white/70 hover:text-cyan-400">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full pulse-ring"></div>
              </Button>
              
              <div className="hidden sm:flex items-center gap-3">
                <Badge variant="outline" className="border-cyan-400/30 text-cyan-300 bg-cyan-500/10 font-medium px-3 py-1">
                  {isVehicleOwner ? 'Vehicle Owner' : 'Service Provider'}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{session.user?.name}</p>
                  <p className="text-xs text-white/60">Welcome back</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="border-red-400/30 text-red-400 hover:bg-red-500/10 font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isVehicleOwner ? (
          /* Vehicle Owner Dashboard */
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold holographic-text">
                  Vehicle Dashboard
                </h2>
                <p className="text-white/70 text-lg">Manage your vehicle issues and maintenance</p>
              </div>
              
              {userProfile && (
                <Card className="cyber-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                        <Car className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                        <h3 className="font-bold text-white text-lg">{userProfile.vehicleModel}</h3>
                        <p className="text-white/70 font-medium">{userProfile.vehicleRegistration}</p>
                        <p className="text-sm text-white/60">Year: {userProfile.vehicleYear}</p>
              </div>
            </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Desktop Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
              <TabsList className="cyber-tabs grid w-full grid-cols-3 p-1 h-14">
                <TabsTrigger value="report" className="cyber-tab">Report Issue</TabsTrigger>
                <TabsTrigger value="history" className="cyber-tab">Issue History</TabsTrigger>
                <TabsTrigger value="profile" className="cyber-tab">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="report">
                <IssueForm 
                  vehicleModel={userProfile?.vehicleModel || 'Unknown'} 
                  onSubmit={(issue) => {
                    console.log('Issue submitted:', issue);
                  }}
                />
              </TabsContent>

              <TabsContent value="history">
                <IssueHistory />
              </TabsContent>

              <TabsContent value="profile">
                {isEditingProfile ? (
                  <EditProfile 
                    userProfile={userProfile}
                    onSave={handleProfileSave}
                    onCancel={() => setIsEditingProfile(false)}
                  />
                ) : (
                  <Card className="cyber-card hover-lift">
                    <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center quantum-glow">
                          <User className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <span className="text-2xl font-bold holographic-text">Profile Information</span>
                          <p className="text-white/60 font-normal">Manage your account details</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      {userProfile ? (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <label className="text-sm font-bold text-white/80 flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-cyan-400" />
                                Full Name
                              </label>
                              <p className="text-xl font-semibold text-white">{userProfile.name}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <label className="text-sm font-bold text-white/80 mb-3 block">Email Address</label>
                              <p className="text-xl font-semibold text-white">{userProfile.email}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <label className="text-sm font-bold text-white/80 mb-3 block">Phone Number</label>
                              <p className="text-xl font-semibold text-white">{userProfile.phone}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <label className="text-sm font-bold text-white/80 flex items-center gap-2 mb-3">
                                <Car className="w-4 h-4 text-cyan-400" />
                                Vehicle Model
                              </label>
                              <p className="text-xl font-semibold text-white">{userProfile.vehicleModel}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <label className="text-sm font-bold text-white/80 mb-3 block">Manufacturing Year</label>
                              <p className="text-xl font-semibold text-white">{userProfile.vehicleYear}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 lg:col-span-2">
                              <label className="text-sm font-bold text-white/80 mb-3 block">Registration Number</label>
                              <p className="text-xl font-semibold text-white">{userProfile.vehicleRegistration}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => setIsEditingProfile(true)}
                            className="holographic-button rounded-2xl shadow-xl px-8 py-3 text-lg font-semibold hover-lift"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="loading-cyber w-12 h-12 mx-auto mb-4"></div>
                            <p className="text-white/60">Loading profile...</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Service Provider Dashboard */
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold holographic-text">
                  Analytics Dashboard
                </h2>
                <p className="text-white/70 text-lg">Professional insights and data analytics</p>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30 text-cyan-300 font-medium px-4 py-2 text-sm">
                Professional Analytics
              </Badge>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
              <TabsList className="cyber-tabs grid w-full grid-cols-5 p-1 h-14">
                <TabsTrigger value="overview" className="cyber-tab">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="cyber-tab">Analytics</TabsTrigger>
                <TabsTrigger value="users" className="cyber-tab">Users</TabsTrigger>
                <TabsTrigger value="reports" className="cyber-tab">Reports</TabsTrigger>
                <TabsTrigger value="settings" className="cyber-tab">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ModernAnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="analytics">
                <ModernAnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="users">
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="matrix-text">User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">User management features coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports">
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="matrix-text">Advanced Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">Advanced reporting features coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="matrix-text">System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">System configuration options coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}
