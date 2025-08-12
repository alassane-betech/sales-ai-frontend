'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  Target, 
  Phone, 
  TrendingUp, 
  Clock,
  ChevronDown,
  User,
  Activity,
  MessageCircle,
  Mail,
  Play,
  BarChart3,
  Calculator
} from 'lucide-react'

// Types
interface OverviewMetrics {
  callsBooked: number
  totalLeads: number
  qualifiedLeads: number
  qualificationRate: number
  showRate: number
  closingRate: number
  upcomingCalls: number
  aiObjectiveRate: number
}

interface TopCloser {
  id: string
  name: string
  avatar: string
  closingRate: number
  dealsClosed: number
  qualifiedLeads: number
}

interface ConversionFunnel {
  visits: number
  bookings: number
  qualified: number
  closed: number
}

interface ActivityItem {
  id: string
  type: 'call' | 'qualification' | 'completion' | 'email'
  message: string
  timestamp: string
  user?: string
  score?: number
}

interface OverviewData {
  metrics: OverviewMetrics
  topCloser: TopCloser
  funnel: ConversionFunnel
  activities: ActivityItem[]
}

// Mock data
const mockOverviewData: OverviewData = {
  metrics: {
    callsBooked: 47,
    totalLeads: 156,
    qualifiedLeads: 89,
    qualificationRate: 57.1,
    showRate: 78.7,
    closingRate: 34.8,
    upcomingCalls: 12,
    aiObjectiveRate: 73.2
  },
  topCloser: {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40',
    closingRate: 42.3,
    dealsClosed: 11,
    qualifiedLeads: 26
  },
  funnel: {
    visits: 1247,
    bookings: 156,
    qualified: 89,
    closed: 31
  },
  activities: [
    {
      id: '1',
      type: 'call',
      message: 'Alice booked a call at 3 PM',
      timestamp: '2 hours ago',
      user: 'Alice'
    },
    {
      id: '2',
      type: 'qualification',
      message: 'WhatsApp flow qualified Bob',
      timestamp: '3 hours ago',
      user: 'Bob',
      score: 82
    },
    {
      id: '3',
      type: 'completion',
      message: 'Call with Carol completed (Recording)',
      timestamp: '4 hours ago',
      user: 'Carol'
    },
    {
      id: '4',
      type: 'email',
      message: 'Email drip sent to Dave (Opened)',
      timestamp: '5 hours ago',
      user: 'Dave'
    },
    {
      id: '5',
      type: 'call',
      message: 'Emma scheduled follow-up call',
      timestamp: '6 hours ago',
      user: 'Emma'
    },
    {
      id: '6',
      type: 'qualification',
      message: 'Lead scoring updated for Frank',
      timestamp: '7 hours ago',
      user: 'Frank',
      score: 67
    }
  ]
}

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'call':
      return <Phone className="w-4 h-4" />
    case 'qualification':
      return <Target className="w-4 h-4" />
    case 'completion':
      return <Play className="w-4 h-4" />
    case 'email':
      return <Mail className="w-4 h-4" />
  }
}

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'call':
      return 'text-blue-400'
    case 'qualification':
      return 'text-green-400'
    case 'completion':
      return 'text-purple-400'
    case 'email':
      return 'text-orange-400'
  }
}

// Components
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  suffix = '', 
  delay = 0 
}: {
  title: string
  value: number
  icon: any
  suffix?: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-white/10 rounded-lg">
        <Icon className="w-5 h-5 text-green-main" />
      </div>
    </div>
    <div className="space-y-2">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-3xl font-bold text-white"
      >
        {formatNumber(value)}{suffix}
      </motion.div>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  </motion.div>
)

const TopCloserCard = ({ closer, delay = 0 }: { closer: TopCloser; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6"
  >
    <h3 className="text-lg font-semibold text-white mb-4">Top Closer</h3>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-green-main to-green-light rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-green-main" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium">{closer.name}</h4>
        <p className="text-gray-400 text-sm">Closing Rate: {closer.closingRate}%</p>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{closer.dealsClosed}/{closer.qualifiedLeads}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(closer.dealsClosed / closer.qualifiedLeads) * 100}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
              className="bg-gradient-to-r from-green-main to-green-light h-2 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

const ConversionFunnel = ({ funnel, delay = 0 }: { funnel: ConversionFunnel; delay?: number }) => {
  const stages = [
    { key: 'visits', label: 'Visits', value: funnel.visits, color: 'from-blue-400 to-blue-600' },
    { key: 'bookings', label: 'Bookings', value: funnel.bookings, color: 'from-purple-400 to-purple-600' },
    { key: 'qualified', label: 'Qualified', value: funnel.qualified, color: 'from-green-400 to-green-600' },
    { key: 'closed', label: 'Closed', value: funnel.closed, color: 'from-green-main to-green-light' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Conversion Funnel</h3>
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const conversionRate = index > 0 
            ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
            : null

          return (
            <div key={stage.key} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-400">{stage.label}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{formatNumber(stage.value)}</span>
                  {conversionRate && (
                    <span className="text-green-main text-sm">{conversionRate}%</span>
                  )}
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.value / stages[0].value) * 100}%` }}
                  transition={{ duration: 1, delay: delay + 0.2 + index * 0.1 }}
                  className={`h-3 bg-gradient-to-r ${stage.color} rounded-full`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

const ObjectiveSimulator = ({ delay = 0 }: { delay?: number }) => {
  const [formData, setFormData] = useState({
    annualRevenueObjective: 1200000,
    targetClosingRate: 25,
    targetShowRate: 80,
    clientLTV: 5000
  })

  const calculateRequiredCalls = () => {
    const { annualRevenueObjective, targetClosingRate, targetShowRate, clientLTV } = formData
    
    // Annual calculations
    const annualRequiredDeals = annualRevenueObjective / clientLTV
    const annualRequiredQualifiedLeads = annualRequiredDeals / (targetClosingRate / 100)
    const annualRequiredBookedCalls = annualRequiredQualifiedLeads / (targetShowRate / 100)
    const qualificationRate = 60
    const annualRequiredTotalLeads = annualRequiredBookedCalls / (qualificationRate / 100)
    
    // Monthly breakdown (assuming 12 months)
    const monthlyRequiredDeals = annualRequiredDeals / 12
    const monthlyRequiredQualifiedLeads = annualRequiredQualifiedLeads / 12
    const monthlyRequiredBookedCalls = annualRequiredBookedCalls / 12
    const monthlyRequiredTotalLeads = annualRequiredTotalLeads / 12
    
    return {
      annual: {
        requiredDeals: Math.ceil(annualRequiredDeals),
        requiredQualifiedLeads: Math.ceil(annualRequiredQualifiedLeads),
        requiredBookedCalls: Math.ceil(annualRequiredBookedCalls),
        requiredTotalLeads: Math.ceil(annualRequiredTotalLeads)
      },
      monthly: {
        requiredDeals: Math.ceil(monthlyRequiredDeals),
        requiredQualifiedLeads: Math.ceil(monthlyRequiredQualifiedLeads),
        requiredBookedCalls: Math.ceil(monthlyRequiredBookedCalls),
        requiredTotalLeads: Math.ceil(monthlyRequiredTotalLeads)
      }
    }
  }

  const results = calculateRequiredCalls()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6 text-green-main" />
        <h2 className="text-2xl font-bold text-white">Objective Simulator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Targets</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Annual Revenue Objective ($)
              </label>
              <input
                type="number"
                value={formData.annualRevenueObjective}
                onChange={(e) => setFormData(prev => ({ ...prev, annualRevenueObjective: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main"
                placeholder="1200000"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Target Closing Rate (%)
              </label>
              <input
                type="number"
                value={formData.targetClosingRate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetClosingRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main"
                placeholder="25"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Target Show Rate (%)
              </label>
              <input
                type="number"
                value={formData.targetShowRate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetShowRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main"
                placeholder="80"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Client LTV ($)
              </label>
              <input
                type="number"
                value={formData.clientLTV}
                onChange={(e) => setFormData(prev => ({ ...prev, clientLTV: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main"
                placeholder="5000"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Required Numbers</h3>
          
          {/* Annual Breakdown */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-green-main mb-3">Annual Targets</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-main/20 rounded-lg">
                    <Target className="w-4 h-4 text-green-main" />
                  </div>
                  <span className="text-gray-300">Total Leads</span>
                </div>
                <span className="text-white font-bold">{results.annual.requiredTotalLeads.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Booked Calls</span>
                </div>
                <span className="text-white font-bold">{results.annual.requiredBookedCalls.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Phone className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300">Leads Who Showed</span>
                </div>
                <span className="text-white font-bold">{results.annual.requiredQualifiedLeads.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-main/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-main" />
                  </div>
                  <span className="text-gray-300">Deals to Close</span>
                </div>
                <span className="text-white font-bold">{results.annual.requiredDeals.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div>
            <h4 className="text-md font-medium text-blue-400 mb-3">Monthly Targets</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-main/20 rounded-lg">
                    <Target className="w-4 h-4 text-green-main" />
                  </div>
                  <span className="text-gray-300">Total Leads</span>
                </div>
                <span className="text-white font-bold">{results.monthly.requiredTotalLeads.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Booked Calls</span>
                </div>
                <span className="text-white font-bold">{results.monthly.requiredBookedCalls.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Phone className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300">Leads Who Showed</span>
                </div>
                <span className="text-white font-bold">{results.monthly.requiredQualifiedLeads.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-main/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-main" />
                  </div>
                  <span className="text-gray-300">Deals to Close</span>
                </div>
                <span className="text-white font-bold">{results.monthly.requiredDeals.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-main/20 to-green-light/20 rounded-lg border border-green-main/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-main/30 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-main" />
                  </div>
                  <span className="text-white font-medium">Monthly Revenue Target</span>
                </div>
                <span className="text-green-main font-bold text-lg">${(formData.annualRevenueObjective / 12).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-main/10 to-green-light/10 border border-green-main/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          To achieve your annual revenue objective of <span className="text-green-main font-semibold">${formData.annualRevenueObjective.toLocaleString()}</span>, 
          you'll need to generate <span className="text-green-main font-semibold">{results.annual.requiredTotalLeads.toLocaleString()}</span> total leads annually 
          (<span className="text-blue-400 font-semibold">{results.monthly.requiredTotalLeads.toLocaleString()}</span> per month), 
          which should result in <span className="text-green-main font-semibold">{results.annual.requiredBookedCalls.toLocaleString()}</span> booked calls annually 
          (<span className="text-blue-400 font-semibold">{results.monthly.requiredBookedCalls.toLocaleString()}</span> per month) 
          and <span className="text-green-main font-semibold">{results.annual.requiredQualifiedLeads.toLocaleString()}</span> leads who showed up annually 
          (<span className="text-blue-400 font-semibold">{results.monthly.requiredQualifiedLeads.toLocaleString()}</span> per month) 
          to close <span className="text-green-main font-semibold">{results.annual.requiredDeals.toLocaleString()}</span> deals annually 
          (<span className="text-blue-400 font-semibold">{results.monthly.requiredDeals.toLocaleString()}</span> per month).
        </p>
      </div>
    </motion.div>
  )
}

const StatsView = ({ data, dateFilter, setDateFilter, delay = 0 }: { 
  data: OverviewData; 
  dateFilter: string; 
  setDateFilter: (value: string) => void; 
  delay?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="space-y-6"
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-green-main" />
        <h2 className="text-2xl font-bold text-white">Performance Stats</h2>
      </div>
      <div className="relative">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-main"
        >
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="custom">Custom</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Total Leads"
        value={data.metrics.totalLeads}
        icon={Users}
        delay={0.1}
      />
      <MetricCard
        title="Qualified Leads"
        value={data.metrics.qualifiedLeads}
        icon={Target}
        delay={0.2}
      />
      <MetricCard
        title="Calls Booked"
        value={data.metrics.callsBooked}
        icon={Calendar}
        delay={0.3}
      />
      <MetricCard
        title="Qualification Rate"
        value={data.metrics.qualificationRate}
        icon={TrendingUp}
        suffix="%"
        delay={0.4}
      />
      <MetricCard
        title="Show Rate"
        value={data.metrics.showRate}
        icon={Phone}
        suffix="%"
        delay={0.5}
      />
      <MetricCard
        title="Closing Rate"
        value={data.metrics.closingRate}
        icon={Target}
        suffix="%"
        delay={0.6}
      />
      <MetricCard
        title="Upcoming Calls"
        value={data.metrics.upcomingCalls}
        icon={Clock}
        delay={0.7}
      />
      <MetricCard
        title="AI Objective Rate"
        value={data.metrics.aiObjectiveRate}
        icon={Target}
        suffix="%"
        delay={0.8}
      />
    </div>

    {/* Bottom Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TopCloserCard closer={data.topCloser} delay={0.9} />
      <ConversionFunnel funnel={data.funnel} delay={1.0} />
    </div>

    {/* Activity Feed */}
    <ActivityFeed activities={data.activities} delay={1.1} />
  </motion.div>
)

const ActivityFeed = ({ activities, delay = 0 }: { activities: ActivityItem[]; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6"
  >
    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
    <div className="space-y-3 max-h-80 overflow-y-auto">
      <AnimatePresence>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-white/10 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{activity.message}</p>
              <p className="text-gray-400 text-xs">{activity.timestamp}</p>
            </div>
            {activity.score && (
              <div className="text-green-main text-sm font-medium">
                {activity.score}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </motion.div>
)

// Main component
export default function OverviewView() {
  const [dateFilter, setDateFilter] = useState('this-week')
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'stats' | 'simulator'>('stats')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData(mockOverviewData)
      setLoading(false)
    }

    fetchData()
  }, [dateFilter])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <div className="w-32 h-10 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-64 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-400">
          <p>No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Overview</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === 'stats'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === 'simulator'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Objective Simulator</span>
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'stats' && data && (
          <StatsView 
            key="stats" 
            data={data} 
            dateFilter={dateFilter} 
            setDateFilter={setDateFilter} 
            delay={0.1} 
          />
        )}
        {activeTab === 'simulator' && (
          <ObjectiveSimulator key="simulator" delay={0.1} />
        )}
      </AnimatePresence>
    </div>
  )
} 