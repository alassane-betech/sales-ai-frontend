"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Clock, 
  Settings, 
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Tag
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  type: 'availability' | 'blocked' | 'custom'
  status: 'active' | 'inactive' | 'pending'
  description?: string
  suffix?: string
  internalNote?: string
  duration: number // in minutes
  increment: number // in minutes
  graceTime: number // in minutes
  settings?: {
    recurring?: boolean
    timezone?: string
    buffer?: number
  }
}

// Mock data
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Weekly Availability Window',
    start: '2024-01-20T09:00:00Z',
    end: '2024-01-20T17:00:00Z',
    type: 'availability',
    status: 'active',
    description: 'Standard working hours for client meetings',
    suffix: 'consultation',
    internalNote: 'Primary availability for new client consultations',
    duration: 60,
    increment: 30,
    graceTime: 15,
    settings: {
      recurring: true,
      timezone: 'America/New_York',
      buffer: 15
    }
  },
  {
    id: '2',
    title: 'Lunch Break Block',
    start: '2024-01-22T12:00:00Z',
    end: '2024-01-22T13:00:00Z',
    type: 'blocked',
    status: 'active',
    description: 'Daily lunch break - no meetings scheduled',
    suffix: 'break',
    internalNote: 'Mandatory break time - no exceptions',
    duration: 60,
    increment: 60,
    graceTime: 0
  },
  {
    id: '3',
    title: 'Custom Availability Period',
    start: '2024-01-25T14:00:00Z',
    end: '2024-01-25T16:00:00Z',
    type: 'custom',
    status: 'pending',
    description: 'Extended availability for urgent client requests',
    suffix: 'urgent',
    internalNote: 'Only for high-priority clients',
    duration: 45,
    increment: 15,
    graceTime: 10
  }
]

export default function CalendarView() {
  // State
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['events']))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Availability state
  const [availability, setAvailability] = useState({
    activeEvents: '3',
    timezone: '(GMT+4:00) Abu Dhabi, Muscat',
    days: {
      monday: { enabled: true, slots: [{ start: '10:00', end: '20:30' }] },
      tuesday: { enabled: true, slots: [{ start: '10:00', end: '20:30' }] },
      wednesday: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
      thursday: { enabled: true, slots: [{ start: '10:00', end: '20:30' }] },
      friday: { enabled: true, slots: [{ start: '15:00', end: '21:30' }] },
      saturday: { enabled: true, slots: [{ start: '10:00', end: '14:00' }] },
      sunday: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] }
    }
  })

  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    suffix: '',
    internalNote: '',
    duration: 30,
    increment: 15,
    graceTime: 5
  })

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // Availability management functions
  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          enabled: !prev.days[day as keyof typeof prev.days].enabled
        }
      }
    }))
  }

  const updateTimeSlot = (day: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: prev.days[day as keyof typeof prev.days].slots.map((slot, index) =>
            index === slotIndex ? { ...slot, [field]: value } : slot
          )
        }
      }
    }))
  }

  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: [...prev.days[day as keyof typeof prev.days].slots, { start: '09:00', end: '17:00' }]
        }
      }
    }))
  }

  const duplicateTimeSlot = (day: string, slotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: [
            ...prev.days[day as keyof typeof prev.days].slots.slice(0, slotIndex + 1),
            prev.days[day as keyof typeof prev.days].slots[slotIndex],
            ...prev.days[day as keyof typeof prev.days].slots.slice(slotIndex + 1)
          ]
        }
      }
    }))
  }

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: prev.days[day as keyof typeof prev.days].slots.filter((_, index) => index !== slotIndex)
        }
      }
    }))
  }



  // Handle new event form
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      setError('Please fill in all required fields')
      return
    }

    // Create new event
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: `${newEvent.date}T${newEvent.time}:00Z`,
      end: `${newEvent.date}T${new Date(`2000-01-01T${newEvent.time}`).getTime() + newEvent.duration * 60000}:00Z`,
      type: 'custom',
      status: 'active',
      description: newEvent.description,
      suffix: newEvent.suffix,
      internalNote: newEvent.internalNote,
      duration: newEvent.duration,
      increment: newEvent.increment,
      graceTime: newEvent.graceTime,
      settings: {
        recurring: false,
        timezone: 'America/New_York',
        buffer: newEvent.graceTime
      }
    }

    setEvents(prev => [event, ...prev])
    setShowCreateModal(false)
    setNewEvent({ 
      title: '', 
      date: '', 
      time: '', 
      description: '', 
      suffix: '', 
      internalNote: '', 
      duration: 30, 
      increment: 15, 
      graceTime: 5 
    })
    setError(null)
  }

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  // Get status badge config
  const getStatusConfig = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'inactive':
        return { color: 'bg-red-100 text-red-800', icon: XCircle }
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: RefreshCw }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="text-gray-300">Manage your booking links, availability, and events</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </button>
            <button
              onClick={() => setShowAvailabilityModal(true)}
              className="px-4 py-2 text-gray-300 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Set Availability
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {/* Calendar Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/10"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Calendar Events & Availability</h2>
              <button
                onClick={() => toggleSection('events')}
                className="text-gray-400 hover:text-gray-300"
              >
                {expandedSections.has('events') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSections.has('events') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {events.map((event) => {
                    const statusConfig = getStatusConfig(event.status)
                    const Icon = statusConfig.icon
                    
                    return (
                      <motion.div
                        key={event.id}
                        whileHover={{ y: -2 }}
                        className="border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium text-white line-clamp-2">{event.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {event.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatEventDate(event.start)}
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.duration}min • {event.increment}min increment
                          </div>
                          
                          {event.suffix && (
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-2" />
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{event.suffix}</span>
                            </div>
                          )}
                          
                          {event.description && (
                            <p className="text-gray-400 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        
                        <button className="mt-3 w-full px-3 py-2 text-sm bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors">
                          View Details
                        </button>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-800 rounded-lg shadow-xl w-full max-w-md border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Create New Event</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/10 text-white placeholder-gray-400"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/10 text-white"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Increment (minutes)
                      </label>
                      <select
                        value={newEvent.increment}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, increment: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grace Time (minutes)
                      </label>
                      <select
                        value={newEvent.graceTime}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, graceTime: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value={0}>No grace time</option>
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Suffix
                    </label>
                    <input
                      type="text"
                      value={newEvent.suffix}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, suffix: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., consultation, meeting, demo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internal Note
                    </label>
                    <textarea
                      value={newEvent.internalNote}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, internalNote: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                      placeholder="Internal notes for team reference..."
                    />
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Event description..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-gray-300 bg-white/10 backdrop-blur-md border border-white/20 rounded-md hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-md hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Availability Setup Modal */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Définissez vos disponibilités</h2>
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>



                {/* Days Configuration */}
                <div className="space-y-4">
                  {Object.entries(availability.days).map(([day, config]) => {
                    const dayNames = {
                      monday: 'Lundi',
                      tuesday: 'Mardi', 
                      wednesday: 'Mercredi',
                      thursday: 'Jeudi',
                      friday: 'Vendredi',
                      saturday: 'Samedi',
                      sunday: 'Dimanche'
                    }
                    
                    return (
                      <div key={day} className="flex items-center space-x-4 p-3 border border-white/10 rounded-lg bg-white/5">
                        {/* Toggle Switch */}
                        <button
                          onClick={() => toggleDayAvailability(day)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.enabled ? 'bg-green-main' : 'bg-white/20'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>

                        {/* Day Label */}
                        <span className="text-sm font-medium text-white min-w-[80px]">
                          {dayNames[day as keyof typeof dayNames]}
                        </span>

                        {/* Time Slots */}
                        {config.enabled && (
                          <div className="flex-1 flex items-center space-x-2">
                            {config.slots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="flex items-center space-x-2">
                                                                 <input
                                   type="time"
                                   value={slot.start}
                                   onChange={(e) => updateTimeSlot(day, slotIndex, 'start', e.target.value)}
                                   className="px-2 py-1 border border-white/20 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-main bg-white/10 text-white"
                                 />
                                 <span className="text-gray-400">-</span>
                                 <input
                                   type="time"
                                   value={slot.end}
                                   onChange={(e) => updateTimeSlot(day, slotIndex, 'end', e.target.value)}
                                   className="px-2 py-1 border border-white/20 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-main bg-white/10 text-white"
                                 />
                                 
                                 {/* Action Buttons */}
                                 <div className="flex items-center space-x-1">
                                   <button
                                     onClick={() => addTimeSlot(day)}
                                     className="p-1 text-gray-400 hover:text-white rounded"
                                     title="Add time slot"
                                   >
                                     <Plus className="w-4 h-4" />
                                   </button>
                                   <button
                                     onClick={() => duplicateTimeSlot(day, slotIndex)}
                                     className="p-1 text-gray-400 hover:text-white rounded"
                                     title="Duplicate time slot"
                                   >
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                     </svg>
                                   </button>
                                   {config.slots.length > 1 && (
                                     <button
                                       onClick={() => removeTimeSlot(day, slotIndex)}
                                       className="p-1 text-red-400 hover:text-red-300 rounded"
                                       title="Remove time slot"
                                     >
                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                       </svg>
                                     </button>
                                   )}
                                 </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="px-4 py-2 text-gray-300 bg-white/10 backdrop-blur-md border border-white/20 rounded-md hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save availability settings
                      console.log('Saving availability:', availability)
                      setShowAvailabilityModal(false)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-md hover:from-green-dark hover:to-green-main transition-colors"
                  >
                    Save Availability
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 