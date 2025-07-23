'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Car, 
  FileText, 
  History, 
  User, 
  BarChart3, 
  Users, 
  Settings, 
  FileBarChart,
  X,
  Zap
} from 'lucide-react';

interface MobileSidebarProps {
  userType: 'vehicle_owner' | 'service_provider';
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
}

export default function MobileSidebar({ userType, activeTab, onTabChange, userName }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const vehicleOwnerTabs = [
    { id: 'report', label: 'Report Issue', icon: FileText },
    { id: 'history', label: 'Issue History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const serviceProviderTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: FileBarChart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const tabs = userType === 'vehicle_owner' ? vehicleOwnerTabs : serviceProviderTabs;

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-80 p-0 cyber-sidebar border-r border-cyan-400/20"
      >
        <SheetHeader className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center quantum-glow">
                <Car className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold holographic-text">
                  Carsor AI
                </SheetTitle>
                <p className="text-xs text-white/60">Professional Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {userName && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{userName}</p>
                  <Badge variant="outline" className="border-cyan-400/30 text-cyan-300 bg-cyan-500/10 text-xs">
                    {userType === 'vehicle_owner' ? 'Vehicle Owner' : 'Service Provider'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 quantum-glow' 
                      : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-white/60'}`} />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                  )}
                </Button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">System Status</span>
            </div>
            <p className="text-xs text-white/60">All systems operational</p>
            <p className="text-xs text-cyan-400 mt-1">AI Engine: Active</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}