"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Video, 
  UserCheck
} from 'lucide-react'
import LeadsView from '@/components/leads-view'
import OverviewView from '@/components/overview-view'
import CalendarView from '@/components/calendar-view'
import MeetingsView from '@/components/meetings-view'
import TeamView from '@/components/team-view'

// Component to render the correct tab view based on activeTab
const TabContent = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case 'overview':
      return <OverviewView />
    case 'calendar':
      return <CalendarView />
    case 'leads':
      return <LeadsView />
    case 'meetings':
      return <MeetingsView />
    case 'team':
      return <TeamView />
    case 'ai-settings':
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              {navigationItems.find(item => item.id === activeTab)?.label}
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome to your {navigationItems.find(item => item.id === activeTab)?.label.toLowerCase()} dashboard
            </p>
          </div>
        </div>
      )
    default:
      return <OverviewView />
  }
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'ai-settings', label: 'AI Settings', icon: Settings },
  { id: 'meetings', label: 'Meetings', icon: Video },
  { id: 'team', label: 'Team', icon: UserCheck },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-main to-green-light rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-main to-green-light bg-clip-text text-transparent">
              SalesAI
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-green-main/20 to-green-light/20 border border-green-main/30 text-green-main'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Active indicator bar */}
                  <div className={`w-1 h-8 rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-main' 
                      : 'bg-transparent group-hover:bg-white/20'
                  }`} />
                  
                  <Icon className={`w-5 h-5 ${isActive ? 'text-green-main' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabContent activeTab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 