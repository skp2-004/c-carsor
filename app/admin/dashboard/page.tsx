'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Wrench, Plus, Edit, Trash2, Eye, EyeOff, LogOut, Car, Settings, Activity, Database, Globe, BarChart3 } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
  phone?: string;
  vehicleModel?: string;
  vehicleRegistration?: string;
  companyName?: string;
  serviceLocation?: string;
  createdAt: string;
  originalPassword?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [serviceProviders, setServiceProviders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [newProvider, setNewProvider] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    serviceLocation: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/admin');
    } else if (session?.user && (session.user as any).userType !== 'admin') {
      router.push('/dashboard');
    } else if (session?.user) {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [usersRes, providersRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/service-providers')
      ]);
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      
      if (providersRes.ok) {
        const providersData = await providersRes.json();
        setServiceProviders(providersData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProvider(true);

    try {
      const response = await fetch('/api/admin/service-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProvider, userType: 'service_provider' }),
      });

      if (response.ok) {
        setNewProvider({ name: '', email: '', password: '', phone: '', companyName: '', serviceLocation: '' });
        fetchData();
        alert('Service provider added successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add service provider');
      }
    } catch (error) {
      alert('Network error occurred');
    } finally {
      setIsAddingProvider(false);
    }
  };

  const handleUpdatePassword = async (userId: string, newPassword: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        alert('Password updated successfully');
        fetchData(); // Refresh to get updated original password
      } else {
        alert('Failed to update password');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  const handleDeleteUser = async (userId: string, userType: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(120,219,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,219,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-medium text-white">Loading Admin Dashboard...</p>
          <p className="text-gray-400 mt-2">Initializing system controls...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.userType !== 'admin') {
    return null;
  }

  const adminTabs = [
    { id: 'users', label: 'Vehicle Owners', icon: <Users className="w-5 h-5" /> },
    { id: 'providers', label: 'Service Providers', icon: <Wrench className="w-5 h-5" /> },
    { id: 'analytics', label: 'System Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
  ];

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

      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 z-30">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Carsor Admin
                </h1>
                <p className="text-xs text-gray-400">System Administration</p>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center border-2 border-red-400/30">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{session.user?.name}</p>
                <Badge 
                  variant="outline" 
                  className="text-xs border-red-400/30 text-red-300 bg-red-500/10 mt-1"
                >
                  Administrator
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-2 px-4">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border border-red-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`transition-colors ${
                    activeTab === tab.id ? 'text-red-400' : 'text-gray-500 group-hover:text-red-400'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="ml-auto w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="outline"
              className="w-full border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-2xl py-3"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 relative z-10">
        {/* Top Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  System Administration
                </h2>
                <p className="text-gray-400 mt-1">
                  Manage users, service providers, and system configuration
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-lg font-bold text-white">{users.length}</p>
                          <p className="text-xs text-gray-400">Vehicle Owners</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-lg font-bold text-white">{serviceProviders.length}</p>
                          <p className="text-xs text-gray-400">Service Providers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-lg font-bold text-white">{users.length + serviceProviders.length}</p>
                          <p className="text-xs text-gray-400">Total Users</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'users' && (
            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  Vehicle Owners Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{user.name}</h4>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="text-sm">
                            <span className="text-gray-400">Vehicle:</span>
                            <span className="text-white ml-2">{user.vehicleModel}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Registration:</span>
                            <span className="text-white ml-2">{user.vehicleRegistration}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Phone:</span>
                            <span className="text-white ml-2">{user.phone}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Original Password:</span>
                            <span className="text-cyan-300 ml-2 font-mono">{user.originalPassword || 'Not available'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Reset Password</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Enter a new password for {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.target as HTMLFormElement);
                              const newPassword = formData.get('password') as string;
                              handleUpdatePassword(user._id, newPassword);
                            }}>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="password" className="text-white">New Password</Label>
                                  <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    className="bg-white/5 border-white/20 text-white"
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                                  Update Password
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user._id, 'vehicle_owner')}
                          className="bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'providers' && (
            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-green-400" />
                  </div>
                  Service Providers Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service Provider
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Service Provider</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Create a new service provider account
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddProvider} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-white">Full Name</Label>
                          <Input
                            id="name"
                            required
                            value={newProvider.name}
                            onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white">Phone</Label>
                          <Input
                            id="phone"
                            required
                            value={newProvider.phone}
                            onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={newProvider.email}
                          onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            value={newProvider.password}
                            onChange={(e) => setNewProvider({ ...newProvider, password: e.target.value })}
                            className="bg-white/5 border-white/20 text-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-white hover:bg-white/10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="companyName" className="text-white">Company Name</Label>
                        <Input
                          id="companyName"
                          required
                          value={newProvider.companyName}
                          onChange={(e) => setNewProvider({ ...newProvider, companyName: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceLocation" className="text-white">Service Location</Label>
                        <Input
                          id="serviceLocation"
                          required
                          placeholder="City, State"
                          value={newProvider.serviceLocation}
                          onChange={(e) => setNewProvider({ ...newProvider, serviceLocation: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" disabled={isAddingProvider}>
                        {isAddingProvider ? 'Adding...' : 'Add Service Provider'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceProviders.map((provider) => (
                    <div key={provider._id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{provider.name}</h4>
                            <p className="text-sm text-gray-400">{provider.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="text-sm">
                            <span className="text-gray-400">Company:</span>
                            <span className="text-white ml-2">{provider.companyName}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white ml-2">{provider.serviceLocation}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Phone:</span>
                            <span className="text-white ml-2">{provider.phone}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Original Password:</span>
                            <span className="text-cyan-300 ml-2 font-mono">{provider.originalPassword || 'Not available'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Reset Password</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Enter a new password for {provider.name}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.target as HTMLFormElement);
                              const newPassword = formData.get('password') as string;
                              handleUpdatePassword(provider._id, newPassword);
                            }}>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="password" className="text-white">New Password</Label>
                                  <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    className="bg-white/5 border-white/20 text-white"
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                                  Update Password
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(provider._id, 'service_provider')}
                          className="bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    User Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-400">Total Users</span>
                      <span className="text-white font-bold">{users.length + serviceProviders.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-400">Vehicle Owners</span>
                      <span className="text-blue-400 font-bold">{users.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-400">Service Providers</span>
                      <span className="text-green-400 font-bold">{serviceProviders.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Activity className="w-6 h-6 text-cyan-400" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400">Database</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Authentication</span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">AI Services</span>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                        Running
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Settings className="w-6 h-6 text-orange-400" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border border-blue-400/30 rounded-2xl bg-blue-500/10">
                    <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Database Configuration
                    </h4>
                    <p className="text-sm text-blue-200">MongoDB connection established and operational</p>
                    <div className="mt-3 text-xs text-blue-300">
                      Collections: users, issues, conversations
                    </div>
                  </div>
                  
                  <div className="p-6 border border-green-400/30 rounded-2xl bg-green-500/10">
                    <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Settings
                    </h4>
                    <p className="text-sm text-green-200">NextAuth.js authentication with bcrypt password hashing</p>
                    <div className="mt-3 text-xs text-green-300">
                      Original passwords stored for development access
                    </div>
                  </div>
                  
                  <div className="p-6 border border-purple-400/30 rounded-2xl bg-purple-500/10">
                    <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      AI Integration
                    </h4>
                    <p className="text-sm text-purple-200">Gemini AI for vehicle diagnostics and chat assistance</p>
                    <div className="mt-3 text-xs text-purple-300">
                      Voice processing and image analysis enabled
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}