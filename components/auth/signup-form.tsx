'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tataModels } from '@/lib/tata-models';
import { Car, User, ArrowLeft, Sparkles } from 'lucide-react';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const userType = 'vehicle_owner';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleRegistration: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType }),
      });

      if (response.ok) {
        router.push('/auth/signin?message=Account created successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Signup failed');
      }
    } catch (error) {
      alert('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,219,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,219,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <Car className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Join AutoDoc AI
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Create your vehicle owner account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <User className="w-5 h-5" />
                <span className="font-semibold">Vehicle Owner Registration</span>
              </div>
              <p className="text-sm text-cyan-200">Service providers are managed by administrators</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/90 font-medium">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl"
                  placeholder="Create password"
                />
                <p className="text-xs text-gray-400">Minimum 8 characters required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleModel" className="text-white/90 font-medium">Tata Vehicle Model</Label>
                <Select value={formData.vehicleModel} onValueChange={(value) => setFormData({ ...formData, vehicleModel: value })}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-cyan-400 h-12 rounded-xl">
                    <SelectValue placeholder="Select your Tata model" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {tataModels.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="text-white hover:bg-white/10">
                        {model.name} ({model.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-white/90 font-medium">Year</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    min="2010"
                    max="2024"
                    required
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl"
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleRegistration" className="text-white/90 font-medium">Registration</Label>
                  <Input
                    id="vehicleRegistration"
                    type="text"
                    required
                    placeholder="MH01AB1234"
                    value={formData.vehicleRegistration}
                    onChange={(e) => setFormData({ ...formData, vehicleRegistration: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white h-12 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Button 
                variant="link" 
                onClick={() => router.push('/auth/signin')} 
                className="p-0 text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Sign In
              </Button>
            </div>
            
            <div className="pt-4 border-t border-white/10 text-center">
              <Button 
                variant="link" 
                onClick={() => router.push('/auth/admin')} 
                className="text-gray-500 hover:text-gray-400 text-sm p-0"
              >
                Administrator Login
              </Button>
            </div>

            <div className="pt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')} 
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}