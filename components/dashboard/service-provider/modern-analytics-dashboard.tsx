'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, Wrench, Car, Users, Clock, DollarSign,
  Activity, Target, Zap, Shield, Award, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, TrendingDown, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, Download, RefreshCw
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

interface AdvancedAnalyticsData {
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
  performanceMetrics: {
    efficiency: number;
    responseTime: number;
    firstCallResolution: number;
    escalationRate: number;
  };
  financialMetrics: {
    totalRevenue: number;
    avgServiceCost: number;
    costPerIssue: number;
    profitMargin: number;
  };
  trendAnalysis: Array<{
    month: string;
    issues: number;
    resolved: number;
    revenue: number;
    satisfaction: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    issues: number;
    avgResolutionTime: number;
    successRate: number;
    customerRating: number;
  }>;
  vehicleModelAnalysis: Array<{
    model: string;
    issues: number;
    reliability: number;
    maintenanceCost: number;
    userSatisfaction: number;
  }>;
  geographicData: Array<{
    region: string;
    issues: number;
    servicecenters: number;
    avgResponseTime: number;
  }>;
  predictiveInsights: Array<{
    insight: string;
    probability: number;
    impact: string;
    recommendation: string;
  }>;
}

export default function ModernAnalyticsDashboard() {
  const [data, setData] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const issuesData = await response.json();
        setIssues(issuesData);
        processAdvancedAnalyticsData(issuesData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAdvancedAnalyticsData = (issuesData: Issue[]) => {
    if (!issuesData || issuesData.length === 0) {
      setData({
        overview: {
          totalIssues: 0,
          resolvedIssues: 0,
          activeIssues: 0,
          criticalIssues: 0,
          totalUsers: 0,
          avgResolutionTime: 0,
          resolutionRate: 0,
          customerSatisfaction: 0,
        },
        performanceMetrics: {
          efficiency: 0,
          responseTime: 0,
          firstCallResolution: 0,
          escalationRate: 0,
        },
        financialMetrics: {
          totalRevenue: 0,
          avgServiceCost: 0,
          costPerIssue: 0,
          profitMargin: 0,
        },
        trendAnalysis: [],
        categoryPerformance: [],
        vehicleModelAnalysis: [],
        geographicData: [],
        predictiveInsights: [],
      });
      return;
    }

    // Enhanced calculations with mock data for demonstration
    const totalIssues = issuesData.length;
    const resolvedIssues = issuesData.filter(issue => issue.status === 'resolved').length;
    const activeIssues = totalIssues - resolvedIssues;
    const criticalIssues = issuesData.filter(issue => issue.severity === 'high').length;
    const uniqueUsers = new Set(issuesData.map(issue => issue.userId)).size;
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    // Mock advanced metrics
    const performanceMetrics = {
      efficiency: Math.min(95, 70 + (resolutionRate * 0.3)),
      responseTime: Math.max(2, 8 - (resolutionRate * 0.05)),
      firstCallResolution: Math.min(90, 60 + (resolutionRate * 0.4)),
      escalationRate: Math.max(5, 25 - (resolutionRate * 0.2)),
    };

    const financialMetrics = {
      totalRevenue: totalIssues * 2500 + Math.random() * 50000,
      avgServiceCost: 1800 + Math.random() * 500,
      costPerIssue: 450 + Math.random() * 200,
      profitMargin: 25 + Math.random() * 15,
    };

    // Trend analysis with enhanced data
    const trendAnalysis = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' });
      const baseIssues = Math.floor(totalIssues / 12) + Math.random() * 10;
      return {
        month,
        issues: Math.floor(baseIssues),
        resolved: Math.floor(baseIssues * 0.8),
        revenue: Math.floor(baseIssues * 2500 + Math.random() * 10000),
        satisfaction: Math.floor(75 + Math.random() * 20),
      };
    });

    // Category performance analysis
    const categories = ['Engine', 'Brakes', 'Electrical', 'AC/Heating', 'Suspension', 'Transmission'];
    const categoryPerformance = categories.map(category => ({
      category,
      issues: Math.floor(totalIssues / categories.length + Math.random() * 10),
      avgResolutionTime: Math.floor(2 + Math.random() * 5),
      successRate: Math.floor(80 + Math.random() * 15),
      customerRating: Math.floor(35 + Math.random() * 10) / 10,
    }));

    // Vehicle model analysis
    const models = ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago'];
    const vehicleModelAnalysis = models.map(model => ({
      model: `Tata ${model}`,
      issues: Math.floor(totalIssues / models.length + Math.random() * 8),
      reliability: Math.floor(75 + Math.random() * 20),
      maintenanceCost: Math.floor(15000 + Math.random() * 10000),
      userSatisfaction: Math.floor(35 + Math.random() * 10) / 10,
    }));

    // Geographic data
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const geographicData = regions.map(region => ({
      region,
      issues: Math.floor(totalIssues / regions.length + Math.random() * 15),
      servicecenters: Math.floor(5 + Math.random() * 10),
      avgResponseTime: Math.floor(2 + Math.random() * 4),
    }));

    // Predictive insights
    const predictiveInsights = [
      {
        insight: 'Engine issues likely to increase by 15% next quarter',
        probability: 78,
        impact: 'High',
        recommendation: 'Increase engine specialist staff and inventory',
      },
      {
        insight: 'Customer satisfaction may drop in AC/Heating category',
        probability: 65,
        impact: 'Medium',
        recommendation: 'Implement proactive AC maintenance program',
      },
      {
        insight: 'Nexon model showing improved reliability trends',
        probability: 85,
        impact: 'Positive',
        recommendation: 'Leverage success story in marketing campaigns',
      },
      {
        insight: 'Service response time optimization needed in North region',
        probability: 72,
        impact: 'Medium',
        recommendation: 'Deploy additional mobile service units',
      },
    ];

    setData({
      overview: {
        totalIssues,
        resolvedIssues,
        activeIssues,
        criticalIssues,
        totalUsers: uniqueUsers,
        avgResolutionTime: Math.round((Math.random() * 3 + 2) * 10) / 10,
        resolutionRate,
        customerSatisfaction: Math.floor(80 + Math.random() * 15),
      },
      performanceMetrics,
      financialMetrics,
      trendAnalysis,
      categoryPerformance,
      vehicleModelAnalysis,
      geographicData,
      predictiveInsights,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Unavailable</h3>
        <p className="text-gray-500">Failed to load analytics data. Please try again.</p>
      </div>
    );
  }

  if (data.overview.totalIssues === 0) {
    return (
      <div className="text-center py-16">
        <BarChart3 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Data Available</h3>
        <p className="text-gray-500 text-lg">Analytics will appear once users start submitting issues.</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e', '#8b5cf6', '#6b7280', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 glass-effect border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="glass-effect border-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass-effect border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData} className="glass-effect border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.overview.totalIssues}</p>
                <p className="text-sm text-gray-600 font-medium">Total Issues</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.overview.resolutionRate}%</p>
                <p className="text-sm text-gray-600 font-medium">Resolution Rate</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.overview.avgResolutionTime}d</p>
                <p className="text-sm text-gray-600 font-medium">Avg Resolution</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">-8%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.overview.customerSatisfaction}%</p>
                <p className="text-sm text-gray-600 font-medium">Satisfaction</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{Math.round(data.performanceMetrics.efficiency)}%</p>
                <p className="text-sm text-gray-600 font-medium">Efficiency</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+7%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">₹{Math.round(data.financialMetrics.totalRevenue / 1000)}K</p>
                <p className="text-sm text-gray-600 font-medium">Revenue</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+15%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.overview.totalUsers}</p>
                <p className="text-sm text-gray-600 font-medium">Active Users</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+22%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{data.overview.criticalIssues}</p>
                <p className="text-sm text-gray-600 font-medium">Critical Issues</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">-18%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 glass-effect border border-white/20 p-1">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="models">Vehicle Models</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Issue Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trendAnalysis}>
                    <defs>
                      <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="issues" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIssues)" strokeWidth={3} />
                    <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Customer Satisfaction Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trendAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[60, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#8b5cf6" 
                      strokeWidth={4}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Category Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={data.categoryPerformance}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Success Rate" dataKey="successRate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="Customer Rating" dataKey="customerRating" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} strokeWidth={2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Efficiency Rate</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(data.performanceMetrics.efficiency)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${data.performanceMetrics.efficiency}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">First Call Resolution</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(data.performanceMetrics.firstCallResolution)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${data.performanceMetrics.firstCallResolution}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Response Time</span>
                      <span className="text-sm font-bold text-gray-900">{data.performanceMetrics.responseTime.toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(10, 100 - (data.performanceMetrics.responseTime * 10))}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Escalation Rate</span>
                      <span className="text-sm font-bold text-gray-900">{data.performanceMetrics.escalationRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${data.performanceMetrics.escalationRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.trendAnalysis}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value) => [`₹${Math.round(Number(value) / 1000)}K`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                  <span className="text-lg font-bold text-green-600">₹{Math.round(data.financialMetrics.totalRevenue / 1000)}K</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Avg Service Cost</span>
                  <span className="text-lg font-bold text-blue-600">₹{Math.round(data.financialMetrics.avgServiceCost)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Cost Per Issue</span>
                  <span className="text-lg font-bold text-purple-600">₹{Math.round(data.financialMetrics.costPerIssue)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Profit Margin</span>
                  <span className="text-lg font-bold text-orange-600">{data.financialMetrics.profitMargin.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Labor', value: 45, color: '#3b82f6' },
                        { name: 'Parts', value: 35, color: '#ef4444' },
                        { name: 'Overhead', value: 15, color: '#f97316' },
                        { name: 'Other', value: 5, color: '#22c55e' },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {[
                        { name: 'Labor', value: 45, color: '#3b82f6' },
                        { name: 'Parts', value: 35, color: '#ef4444' },
                        { name: 'Overhead', value: 15, color: '#f97316' },
                        { name: 'Other', value: 5, color: '#22c55e' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Vehicle Model Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={data.vehicleModelAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="reliability" name="Reliability" unit="%" stroke="#6b7280" />
                  <YAxis dataKey="userSatisfaction" name="Satisfaction" unit="/5" stroke="#6b7280" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
                            <p className="font-semibold">{data.model}</p>
                            <p className="text-sm">Reliability: {data.reliability}%</p>
                            <p className="text-sm">Satisfaction: {data.userSatisfaction}/5</p>
                            <p className="text-sm">Issues: {data.issues}</p>
                            <p className="text-sm">Maintenance: ₹{data.maintenanceCost}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Models" dataKey="userSatisfaction" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.geographicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="servicecenters" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Service Center Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.geographicData.map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium">{region.region} Region</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{region.servicecenters} Centers</p>
                      <p className="text-xs text-gray-500">{region.avgResponseTime}h avg response</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Predictive Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.predictiveInsights.map((insight, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{insight.insight}</h4>
                        <p className="text-gray-600 text-sm mb-3">{insight.recommendation}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Probability:</span>
                          <Badge variant={insight.probability > 75 ? 'destructive' : insight.probability > 50 ? 'default' : 'secondary'}>
                            {insight.probability}%
                          </Badge>
                        </div>
                        <Badge variant={insight.impact === 'High' ? 'destructive' : insight.impact === 'Medium' ? 'default' : 'secondary'}>
                          {insight.impact} Impact
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          insight.probability > 75 ? 'bg-red-500' : 
                          insight.probability > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${insight.probability}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}