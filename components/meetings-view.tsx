'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Pause,
  Volume2,
  Maximize2,
  ArrowLeft,
  FileText,
  User,
  Phone,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'

// Types
interface Meeting {
  id: string
  title: string
  date: string
  time: string
  duration: number // in minutes
  status: 'upcoming' | 'completed' | 'cancelled'
  type: 'call' | 'video' | 'in-person'
  attendees: Attendee[]
  recording?: {
    url: string
    duration: number
    thumbnail: string
  }
  recap?: {
    summary: string
    keyPoints: string[]
    actionItems: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
  }
  notes?: string
}

interface Attendee {
  id: string
  name: string
  email: string
  role: 'host' | 'attendee' | 'guest'
  avatar?: string
  initials: string
  status: 'joined' | 'declined' | 'pending' | 'no-show'
}

// Mock data
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Sales Demo - TechCorp',
    date: '2024-01-15',
    time: '14:00',
    duration: 45,
    status: 'completed',
    type: 'video',
    attendees: [
      { id: '1', name: 'Adrien Gavel', email: 'adrien@company.com', role: 'host', initials: 'AG', status: 'joined' },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@techcorp.com', role: 'attendee', initials: 'SJ', status: 'joined' },
      { id: '3', name: 'Mike Chen', email: 'mike@techcorp.com', role: 'attendee', initials: 'MC', status: 'joined' }
    ],
    recording: {
      url: '/api/recordings/meeting-1.mp4',
      duration: 2700, // 45 minutes in seconds
      thumbnail: '/api/thumbnails/meeting-1.jpg'
    },
    recap: {
      summary: 'Successful product demonstration with TechCorp team. Sarah showed strong interest in our enterprise features, particularly the AI-powered analytics. Mike had concerns about integration complexity.',
      keyPoints: [
        'TechCorp interested in enterprise plan',
        'AI analytics features well received',
        'Integration timeline discussed (3-4 weeks)',
        'Follow-up meeting scheduled for next week'
      ],
      actionItems: [
        'Send detailed integration documentation',
        'Schedule technical deep-dive session',
        'Prepare enterprise pricing proposal',
        'Follow up with Sarah on Friday'
      ],
      sentiment: 'positive'
    }
  },
  {
    id: '2',
    title: 'Discovery Call - StartupXYZ',
    date: '2024-01-16',
    time: '10:30',
    duration: 30,
    status: 'upcoming',
    type: 'call',
    attendees: [
      { id: '1', name: 'Adrien Gavel', email: 'adrien@company.com', role: 'host', initials: 'AG', status: 'pending' },
      { id: '4', name: 'Alex Rodriguez', email: 'alex@startupxyz.com', role: 'attendee', initials: 'AR', status: 'pending' }
    ]
  },
  {
    id: '3',
    title: 'Follow-up - Enterprise Solutions',
    date: '2024-01-14',
    time: '16:00',
    duration: 60,
    status: 'completed',
    type: 'video',
    attendees: [
      { id: '1', name: 'Adrien Gavel', email: 'adrien@company.com', role: 'host', initials: 'AG', status: 'joined' },
      { id: '5', name: 'Emma Wilson', email: 'emma@enterprise.com', role: 'attendee', initials: 'EW', status: 'joined' },
      { id: '6', name: 'David Kim', email: 'david@enterprise.com', role: 'attendee', initials: 'DK', status: 'no-show' }
    ],
    recording: {
      url: '/api/recordings/meeting-3.mp4',
      duration: 3600,
      thumbnail: '/api/thumbnails/meeting-3.jpg'
    },
    recap: {
      summary: 'Comprehensive follow-up meeting with Enterprise Solutions. Emma was very engaged and asked detailed questions about scalability and security. David was unable to attend due to scheduling conflict.',
      keyPoints: [
        'Security compliance requirements discussed',
        'Scalability concerns addressed',
        'Custom integration needs identified',
        'Budget approval process outlined'
      ],
      actionItems: [
        'Provide security audit documentation',
        'Create custom integration proposal',
        'Schedule demo with technical team',
        'Reschedule meeting with David'
      ],
      sentiment: 'positive'
    }
  },
  {
    id: '4',
    title: 'Contract Negotiation - GlobalTech',
    date: '2024-01-13',
    time: '11:00',
    duration: 90,
    status: 'completed',
    type: 'in-person',
    attendees: [
      { id: '1', name: 'Adrien Gavel', email: 'adrien@company.com', role: 'host', initials: 'AG', status: 'joined' },
      { id: '7', name: 'Lisa Thompson', email: 'lisa@globaltech.com', role: 'attendee', initials: 'LT', status: 'joined' }
    ],
    notes: 'In-person meeting at GlobalTech headquarters. Contract terms finalized with minor adjustments to payment schedule.'
  },
  {
    id: '5',
    title: 'Product Training - New Client',
    date: '2024-01-17',
    time: '13:00',
    duration: 120,
    status: 'upcoming',
    type: 'video',
    attendees: [
      { id: '1', name: 'Adrien Gavel', email: 'adrien@company.com', role: 'host', initials: 'AG', status: 'pending' },
      { id: '8', name: 'Tom Anderson', email: 'tom@newclient.com', role: 'attendee', initials: 'TA', status: 'pending' },
      { id: '9', name: 'Rachel Green', email: 'rachel@newclient.com', role: 'attendee', initials: 'RG', status: 'pending' }
    ]
  }
]

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (timeString: string) => {
  return timeString
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const getStatusColor = (status: Meeting['status']) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'completed':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    case 'cancelled':
      return 'bg-red-500/20 text-red-300 border-red-500/30'
  }
}

const getTypeIcon = (type: Meeting['type']) => {
  switch (type) {
    case 'call':
      return Phone
    case 'video':
      return Video
    case 'in-person':
      return Users
  }
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-400'
    case 'negative':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

// Components
const MeetingCard = ({ meeting, onClick }: { meeting: Meeting; onClick: () => void }) => {
  const TypeIcon = getTypeIcon(meeting.type)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <TypeIcon className="w-5 h-5 text-green-main" />
          <h3 className="text-white font-medium">{meeting.title}</h3>
        </div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
          {meeting.status}
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatTime(meeting.time)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{meeting.attendees.length} attendees</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{formatDuration(meeting.duration)}</span>
        {meeting.recording && (
          <div className="flex items-center space-x-1 text-green-main">
            <Play className="w-4 h-4" />
            <span className="text-xs">Recording available</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const MeetingDetail = ({ meeting, onBack }: { meeting: Meeting; onBack: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to meetings</span>
        </button>
        <h1 className="text-2xl font-bold text-white">{meeting.title}</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Recording & Attendees */}
        <div className="space-y-6">
          {/* Recording */}
          {meeting.recording && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
              <div className="aspect-video bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-main/20 rounded-full flex items-center justify-center mb-4">
                      <Play className="w-8 h-8 text-green-main" />
                    </div>
                    <p className="text-gray-400">Recording available</p>
                    <p className="text-sm text-gray-500">{formatDuration(meeting.recording.duration / 60)}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span>00:00 / {formatDuration(meeting.recording.duration / 60)}</span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendees */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-main" />
              <span>Attendees ({meeting.attendees.length})</span>
            </h3>
            <div className="space-y-3">
              {meeting.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {attendee.initials}
                    </div>
                    <div>
                      <p className="text-white font-medium">{attendee.name}</p>
                      <p className="text-sm text-gray-400">{attendee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      attendee.status === 'joined' ? 'bg-green-500/20 text-green-300' :
                      attendee.status === 'declined' ? 'bg-red-500/20 text-red-300' :
                      attendee.status === 'no-show' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {attendee.status}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{attendee.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Recap */}
        <div className="space-y-6">
          {meeting.recap ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-main" />
                  <span>AI Meeting Recap</span>
                </h3>
                <div className={`flex items-center space-x-1 ${getSentimentColor(meeting.recap.sentiment)}`}>
                  {meeting.recap.sentiment === 'positive' && <CheckCircle className="w-4 h-4" />}
                  {meeting.recap.sentiment === 'negative' && <XCircle className="w-4 h-4" />}
                  <span className="text-sm capitalize">{meeting.recap.sentiment}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">Summary</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{meeting.recap.summary}</p>
              </div>

              {/* Key Points */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Key Points</h4>
                <ul className="space-y-2">
                  {meeting.recap.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-main rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              <div>
                <h4 className="text-white font-medium mb-3">Action Items</h4>
                <ul className="space-y-2">
                  {meeting.recap.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No AI recap available</p>
                <p className="text-sm text-gray-500">Recap will be generated after meeting completion</p>
              </div>
            </div>
          )}

          {/* Meeting Notes */}
          {meeting.notes && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-main" />
                <span>Meeting Notes</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{meeting.notes}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Main component
export default function MeetingsView() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesFilter = selectedFilter === 'all' || meeting.status === selectedFilter
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.attendees.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })

  if (selectedMeeting) {
    return <MeetingDetail meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-green-main" />
          <div>
            <h1 className="text-3xl font-bold text-white">Meetings</h1>
            <p className="text-gray-400">Manage and review your meetings</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-dark hover:to-green-main transition-all duration-200 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { id: 'all', label: 'All Meetings' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-green-main text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onClick={() => setSelectedMeeting(meeting)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No meetings found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Showing {filteredMeetings.length} of {mockMeetings.length} meetings</span>
          <div className="flex items-center space-x-4">
            <span>Upcoming: {mockMeetings.filter(m => m.status === 'upcoming').length}</span>
            <span>Completed: {mockMeetings.filter(m => m.status === 'completed').length}</span>
            <span>With Recording: {mockMeetings.filter(m => m.recording).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 