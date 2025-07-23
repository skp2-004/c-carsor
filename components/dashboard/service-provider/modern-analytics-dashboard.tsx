'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ResponsiveContainer as RC,
  BarChart as BC,
  PieChart as PC,
  LineChart as LC,
  AreaChart as AC,
  RadarChart as RDC,
  ScatterChart as SC,
  XAxis as X,
  YAxis as Y,
  CartesianGrid as CG,
  Tooltip as TT,
  Bar as B,
  Pie as P,
  Cell as C,
  Line as L,
  Area as A,
  Radar as R,
  Scatter as S,
  PolarGrid as PG,
  PolarAngleAxis as PAA,
  PolarRadiusAxis as PRA
} from 'recharts';

import type { ComponentType } from 'react';

// Cast to bypass JSX incompatibility
const ResponsiveContainer = RC as unknown as ComponentType<any>;
const BarChart = BC as unknown as ComponentType<any>;
const PieChart = PC as unknown as ComponentType<any>;
const LineChart = LC as unknown as ComponentType<any>;
const AreaChart = AC as unknown as ComponentType<any>;
const RadarChart = RDC as unknown as ComponentType<any>;
const ScatterChart = SC as unknown as ComponentType<any>;

const XAxis = X as unknown as ComponentType<any>;
const YAxis = Y as unknown as ComponentType<any>;
const CartesianGrid = CG as unknown as ComponentType<any>;
const Tooltip = TT as unknown as ComponentType<any>;

const Bar = B as unknown as ComponentType<any>;
const Pie = P as unknown as ComponentType<any>;
const Cell = C as unknown as ComponentType<any>;
const Line = L as unknown as ComponentType<any>;
const Area = A as unknown as ComponentType<any>;
const Radar = R as unknown as ComponentType<any>;
const Scatter = S as unknown as ComponentType<any>;

const PolarGrid = PG as unknown as ComponentType<any>;
const PolarAngleAxis = PAA as unknown as ComponentType<any>;
const PolarRadiusAxis = PRA as unknown as ComponentType<any>;

import { 
  TrendingUp, AlertTriangle, Wrench, Car, Users, Clock, DollarSign,
  Activity, Target, Zap, Shield, Award, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, TrendingDown, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, Download, RefreshCw, Factory, Bug, Settings, Gauge
} from 'lucide-react';

interface Issue {
  _id: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  vehicleModel: string;
  createdAt: string;
  resolvedAt?: string;
  userId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleRegistration?: string;
  createdAt: string;
}

interface RealAnalyticsData {
  overview: {
    totalIssues: number;
    resolvedIssues: number;
    activeIssues: number;
    criticalIssues: number;
    totalUsers: number;
    avgResolutionTime: number;
    resolutionRate: number;
    customerSatisfaction: number;
  };
  issuesByModel: Array<{
    model: string;
    issues: number;
    resolved: number;
    resolutionRate: number;
    reliability: number;
  }>;
  issuesByCategory: Array<{
    category: string;
    count: number;
    percentage: number;
    avgSeverity: number;
  }>;
  severityDistribution: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    issues: number;
    resolved: number;
    users: number;
  }>;
  manufacturingDefects: Array<{
    defect: string;
    frequency: number;
    affectedModels: string[];
    severity: string;
    impact: string;
    recommendation: string;
  }>;
  qualityMetrics: {
    overallReliability: number;
    defectRate: number;
    customerRetention: number;
    warrantyClaimRate: number;
  };
  geographicAnalysis: Array<{
    region: string;
    issues: number;
    users: number;
    avgResolutionTime: number;
  }>;
}

export default function ModernAnalyticsDashboard() {
  const [data, setData] = useState<RealAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    fetchRealAnalyticsData();
  }, [timeRange]);

  const fetchRealAnalyticsData = async () => {
    try {
      const [issuesResponse, usersResponse] = await Promise.all([
        fetch('/api/issues'),
        fetch('/api/admin/users')
      ]);
      
      if (issuesResponse.ok && usersResponse.ok) {
        const issuesData = await issuesResponse.json();
        const usersData = await usersResponse.json();
        setIssues(issuesData);
        setUsers(usersData);
        processRealAnalyticsData(issuesData, usersData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRealAnalyticsData = (issuesData: Issue[], usersData: User[]) => {
    if (!issuesData || issuesData.length === 0) {
      setData({
        overview: {
          totalIssues: 0,
          resolvedIssues: 0,
          activeIssues: 0,
          criticalIssues: 0,
          totalUsers: usersData?.length || 0,
          avgResolutionTime: 0,
          resolutionRate: 0,
          customerSatisfaction: 0,
        },
        issuesByModel: [],
        issuesByCategory: [],
        severityDistribution: [],
        monthlyTrends: [],
        manufacturingDefects: [],
        qualityMetrics: {
          overallReliability: 0,
          defectRate: 0,
          customerRetention: 0,
          warrantyClaimRate: 0,
        },
        geographicAnalysis: [],
      });
      return;
    }

    // Overview calculations
    const totalIssues = issuesData.length;
    const resolvedIssues = issuesData.filter(issue => issue.status === 'resolved').length;
    const activeIssues = totalIssues - resolvedIssues;
    const criticalIssues = issuesData.filter(issue => issue.severity === 'high').length;
    const totalUsers = usersData?.length || 0;
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    // Calculate average resolution time from real data
    const resolvedWithTime = issuesData.filter(issue => issue.status === 'resolved' && issue.resolvedAt);
    const avgResolutionTime = resolvedWithTime.length > 0 
      ? resolvedWithTime.reduce((acc, issue) => {
          const created = new Date(issue.createdAt);
          const resolved = new Date(issue.resolvedAt!);
          return acc + (resolved.getTime() - created.getTime());
        }, 0) / resolvedWithTime.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Issues by model analysis
    const modelCounts = issuesData.reduce((acc, issue) => {
      const model = issue.vehicleModel || 'Unknown';
      if (!acc[model]) {
        acc[model] = { total: 0, resolved: 0 };
      }
      acc[model].total++;
      if (issue.status === 'resolved') {
        acc[model].resolved++;
      }
      return acc;
    }, {} as Record<string, { total: number; resolved: number }>);

    const issuesByModel = Object.entries(modelCounts).map(([model, counts]) => ({
      model,
      issues: counts.total,
      resolved: counts.resolved,
      resolutionRate: counts.total > 0 ? Math.round((counts.resolved / counts.total) * 100) : 0,
      reliability: counts.total > 0 ? Math.max(0, 100 - (counts.total / totalUsers * 100)) : 100,
    })).sort((a, b) => b.issues - a.issues);

    // Issues by category analysis
    const categoryCounts = issuesData.reduce((acc, issue) => {
      const category = issue.category || 'Other';
      if (!acc[category]) {
        acc[category] = { count: 0, severitySum: 0 };
      }
      acc[category].count++;
      acc[category].severitySum += issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1;
      return acc;
    }, {} as Record<string, { count: number; severitySum: number }>);

    const issuesByCategory = Object.entries(categoryCounts).map(([category, data]) => ({
      category,
      count: data.count,
      percentage: Math.round((data.count / totalIssues) * 100),
      avgSeverity: Math.round((data.severitySum / data.count) * 10) / 10,
    })).sort((a, b) => b.count - a.count);

    // Severity distribution
    const severityCounts = issuesData.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityDistribution = Object.entries(severityCounts).map(([severity, count]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count,
      percentage: Math.round((count / totalIssues) * 100),
    }));

    // Monthly trends analysis
    const monthlyData = {} as Record<string, { issues: number; resolved: number; users: number }>;
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[monthKey] = { issues: 0, resolved: 0, users: 0 };
    }

    issuesData.forEach(issue => {
      const issueDate = new Date(issue.createdAt);
      const monthKey = issueDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].issues++;
        if (issue.status === 'resolved') {
          monthlyData[monthKey].resolved++;
        }
      }
    });

    usersData?.forEach(user => {
      const userDate = new Date(user.createdAt);
      const monthKey = userDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].users++;
      }
    });

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      issues: data.issues,
      resolved: data.resolved,
      users: data.users,
    }));

    // Manufacturing defects analysis
    const defectPatterns = {} as Record<string, {
      frequency: number;
      severity: Record<string, number>;
      models: Set<string>;
      descriptions: string[];
    }>;

    issuesData.forEach(issue => {
      const category = issue.category || 'Other';
      const key = category;
      
      if (!defectPatterns[key]) {
        defectPatterns[key] = {
          frequency: 0,
          severity: { low: 0, medium: 0, high: 0 },
          models: new Set(),
          descriptions: [],
        };
      }
      
      defectPatterns[key].frequency++;
      defectPatterns[key].severity[issue.severity]++;
      defectPatterns[key].models.add(issue.vehicleModel);
      defectPatterns[key].descriptions.push(issue.description);
    });

    const manufacturingDefects = Object.entries(defectPatterns)
      .map(([pattern, data]) => {
        const mostCommonSeverity = Object.entries(data.severity)
          .sort(([,a], [,b]) => b - a)[0][0];
        
        const impact = data.frequency > totalIssues * 0.2 ? 'High' : 
                      data.frequency > totalIssues * 0.1 ? 'Medium' : 'Low';
        
        const recommendation = getDefectRecommendation(pattern, data.frequency, mostCommonSeverity);
        
        return {
          defect: `${pattern} Issues`,
          frequency: data.frequency,
          affectedModels: Array.from(data.models),
          severity: mostCommonSeverity,
          impact,
          recommendation,
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Quality metrics
    const qualityMetrics = {
      overallReliability: Math.max(0, 100 - (totalIssues / Math.max(totalUsers, 1) * 10)),
      defectRate: totalUsers > 0 ? Math.round((totalIssues / totalUsers) * 100) : 0,
      customerRetention: Math.max(70, 100 - (criticalIssues / Math.max(totalUsers, 1) * 50)),
      warrantyClaimRate: Math.round((criticalIssues / Math.max(totalIssues, 1)) * 100),
    };

    // Geographic analysis (simulated based on user distribution)
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const geographicAnalysis = regions.map(region => {
      const regionUsers = Math.floor(totalUsers / regions.length + Math.random() * 5);
      const regionIssues = Math.floor(totalIssues / regions.length + Math.random() * 3);
      return {
        region,
        issues: regionIssues,
        users: regionUsers,
        avgResolutionTime: Math.round((avgResolutionTime + Math.random() * 2) * 10) / 10,
      };
    });

    setData({
      overview: {
        totalIssues,
        resolvedIssues,
        activeIssues,
        criticalIssues,
        totalUsers,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        resolutionRate,
        customerSatisfaction: Math.max(60, 100 - (criticalIssues / Math.max(totalIssues, 1) * 40)),
      },
      issuesByModel,
      issuesByCategory,
      severityDistribution,
      monthlyTrends,
      manufacturingDefects,
      qualityMetrics,
      geographicAnalysis,
    });
  };

  const getDefectRecommendation = (category: string, frequency: number, severity: string): string => {
    const recommendations = {
      'Engine': 'Improve engine quality control and testing procedures',
      'Brakes': 'Enhance brake system manufacturing standards',
      'Electrical': 'Upgrade electrical component sourcing and testing',
      'AC/Heating': 'Review HVAC system design and assembly process',
      'Suspension': 'Strengthen suspension component materials',
      'Transmission': 'Implement advanced transmission testing protocols',
      'Body': 'Improve body panel manufacturing precision',
      'Fuel System': 'Enhance fuel system component quality',
      'Exhaust': 'Review exhaust system design specifications',
      'Steering': 'Implement stricter steering system quality checks',
    };
    
    return recommendations[category as keyof typeof recommendations] || 'Conduct detailed root cause analysis';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 futuristic-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-white">Loading Enterprise Analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 futuristic-bg">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Analytics Unavailable</h3>
        <p className="text-white/60">Failed to load analytics data. Please try again.</p>
      </div>
    );
  }

  if (data.overview.totalIssues === 0) {
    return (
      <div className="text-center py-16 futuristic-bg">
        <BarChart3 className="w-20 h-20 text-cyan-400 mx-auto mb-6 floating-orb" />
        <h3 className="text-2xl font-semibold text-white mb-4 holographic-text">No Data Available</h3>
        <p className="text-white/60 text-lg">Analytics will appear once users start submitting issues.</p>
      </div>
    );
  }

  const COLORS = ['#78dbff', '#ff77c6', '#00ff88', '#ffaa00', '#ff4444', '#8b5cf6', '#6b7280', '#ec4899'];

  return (
    <div className="space-y-8 futuristic-bg min-h-screen p-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 cyber-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-cyan-400/30">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="neon-button">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="neon-button">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchRealAnalyticsData} className="neon-button">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.overview.totalIssues}</p>
                <p className="text-sm text-white/60 font-medium">Total Issues</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Car className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">Real Data</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.overview.resolutionRate}%</p>
                <p className="text-sm text-white/60 font-medium">Resolution Rate</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Wrench className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">+{Math.round(data.overview.resolutionRate/10)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.overview.avgResolutionTime}d</p>
                <p className="text-sm text-white/60 font-medium">Avg Resolution</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">Optimized</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.overview.customerSatisfaction}%</p>
                <p className="text-sm text-white/60 font-medium">Satisfaction</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">High</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{Math.round(data.qualityMetrics.overallReliability)}%</p>
                <p className="text-sm text-white/60 font-medium">Reliability</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Gauge className="w-4 h-4 text-cyan-400 mr-1" />
              <span className="text-sm text-cyan-400 font-medium">Quality</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.qualityMetrics.defectRate}%</p>
                <p className="text-sm text-white/60 font-medium">Defect Rate</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Bug className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Factory className="w-4 h-4 text-pink-400 mr-1" />
              <span className="text-sm text-pink-400 font-medium">Manufacturing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.overview.totalUsers}</p>
                <p className="text-sm text-white/60 font-medium">Active Users</p>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <Users className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">Growing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-orb hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{data.overview.criticalIssues}</p>
                <p className="text-sm text-white/60 font-medium">Critical Issues</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center quantum-glow">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Target className="w-4 h-4 text-orange-400 mr-1" />
              <span className="text-sm text-orange-400 font-medium">Priority</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="cyber-tabs grid w-full grid-cols-2 lg:grid-cols-6 p-1">
          <TabsTrigger value="overview" className="cyber-tab">Overview</TabsTrigger>
          <TabsTrigger value="models" className="cyber-tab">Vehicle Models</TabsTrigger>
          <TabsTrigger value="defects" className="cyber-tab">Manufacturing</TabsTrigger>
          <TabsTrigger value="trends" className="cyber-tab">Trends</TabsTrigger>
          <TabsTrigger value="quality" className="cyber-tab">Quality</TabsTrigger>
          <TabsTrigger value="geographic" className="cyber-tab">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 matrix-text">
                  <PieChartIcon className="w-5 h-5" />
                  Issue Distribution by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.issuesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ category, percentage }: { category: string; percentage: number }) =>
  `${category}: ${percentage}%`
}

                    >
                      {data.issuesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 35, 0.95)', 
                        border: '1px solid rgba(120, 219, 255, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 matrix-text">
                  <BarChart3 className="w-5 h-5" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.severityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        item.severity === 'High' ? 'bg-red-400' : 
                        item.severity === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                      } quantum-glow`}></div>
                      <span className="font-medium text-white">{item.severity} Severity</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">{item.count}</span>
                      <span className="text-sm text-white/60 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="matrix-text">Vehicle Model Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.issuesByModel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 219, 255, 0.2)" />
                  <XAxis dataKey="model" stroke="#78dbff" />
                  <YAxis stroke="#78dbff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 15, 35, 0.95)', 
                      border: '1px solid rgba(120, 219, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }} 
                  />
                  <Bar dataKey="issues" fill="#78dbff" name="Total Issues" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#00ff88" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defects" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 matrix-text">
                <Factory className="w-5 h-5" />
                Manufacturing Defects & Quality Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.manufacturingDefects.length > 0 ? (
                  data.manufacturingDefects.map((defect, index) => (
                    <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg mb-2">{defect.defect}</h4>
                          <p className="text-white/70 text-sm mb-3">{defect.recommendation}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {defect.affectedModels.map((model, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-cyan-400/30 text-cyan-300">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-white/80">Frequency:</span>
                            <Badge variant={defect.frequency > 10 ? 'destructive' : defect.frequency > 5 ? 'default' : 'secondary'}>
                              {defect.frequency}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-white/80">Impact:</span>
                            <Badge variant={defect.impact === 'High' ? 'destructive' : defect.impact === 'Medium' ? 'default' : 'secondary'}>
                              {defect.impact}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white/80">Severity:</span>
                            <Badge variant={defect.severity === 'high' ? 'destructive' : defect.severity === 'medium' ? 'default' : 'secondary'}>
                              {defect.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            defect.frequency > 10 ? 'bg-red-400' : 
                            defect.frequency > 5 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${Math.min(100, (defect.frequency / Math.max(...data.manufacturingDefects.map(d => d.frequency))) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-white/60 py-8">No manufacturing defects identified yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 matrix-text">
                <LineChartIcon className="w-5 h-5" />
                Monthly Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data.monthlyTrends}>
                  <defs>
                    <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#78dbff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#78dbff" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff77c6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff77c6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 219, 255, 0.2)" />
                  <XAxis dataKey="month" stroke="#78dbff" />
                  <YAxis stroke="#78dbff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 15, 35, 0.95)', 
                      border: '1px solid rgba(120, 219, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }} 
                  />
                  <Area type="monotone" dataKey="issues" stroke="#78dbff" fillOpacity={1} fill="url(#colorIssues)" strokeWidth={3} />
                  <Area type="monotone" dataKey="resolved" stroke="#00ff88" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} />
                  <Area type="monotone" dataKey="users" stroke="#ff77c6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="matrix-text">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white/80">Overall Reliability</span>
                    <span className="text-sm font-bold text-white">{Math.round(data.qualityMetrics.overallReliability)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${data.qualityMetrics.overallReliability}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white/80">Customer Retention</span>
                    <span className="text-sm font-bold text-white">{Math.round(data.qualityMetrics.customerRetention)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${data.qualityMetrics.customerRetention}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white/80">Defect Rate</span>
                    <span className="text-sm font-bold text-white">{data.qualityMetrics.defectRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, data.qualityMetrics.defectRate)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white/80">Warranty Claim Rate</span>
                    <span className="text-sm font-bold text-white">{data.qualityMetrics.warrantyClaimRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-yellow-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${data.qualityMetrics.warrantyClaimRate}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="matrix-text">Model Reliability Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={data.issuesByModel.slice(0, 6)}>
                    <PolarGrid stroke="rgba(120, 219, 255, 0.2)" />
                    <PolarAngleAxis dataKey="model" tick={{ fontSize: 12, fill: '#78dbff' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#78dbff' }} />
                    <Radar name="Reliability" dataKey="reliability" stroke="#78dbff" fill="#78dbff" fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="Resolution Rate" dataKey="resolutionRate" stroke="#00ff88" fill="#00ff88" fillOpacity={0.3} strokeWidth={2} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 35, 0.95)', 
                        border: '1px solid rgba(120, 219, 255, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="matrix-text">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.geographicAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 219, 255, 0.2)" />
                    <XAxis dataKey="region" stroke="#78dbff" />
                    <YAxis stroke="#78dbff" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 35, 0.95)', 
                        border: '1px solid rgba(120, 219, 255, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }} 
                    />
                    <Bar dataKey="issues" fill="#78dbff" name="Issues" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="users" fill="#ff77c6" name="Users" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {data.geographicAnalysis.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium text-white">{region.region} Region</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{region.issues} Issues</p>
                        <p className="text-xs text-white/60">{region.users} Users</p>
                        <p className="text-xs text-white/60">{region.avgResolutionTime}d avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
