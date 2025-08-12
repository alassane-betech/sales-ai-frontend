"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Clock, 
  MessageSquare, 
  Mail, 
  Mic, 
  BarChart3, 
  Zap,
  Globe,
  Shield,
  Users,
  Target
} from 'lucide-react'

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Timezone-aware slots, buffer times, auto-reminders with intelligent conflict resolution.",
      color: "from-neon-blue to-primary-500"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp AI Flows",
      description: "Qualification via chat + VoIP dialing with natural language processing.",
      color: "from-neon-teal to-accent-500"
    },
    {
      icon: Mail,
      title: "Email Sequences",
      description: "Dynamic templates with subject-line A/B tests and personalized content generation.",
      color: "from-neon-purple to-pink-500"
    },
    {
      icon: Mic,
      title: "Meeting Intelligence",
      description: "Whisper transcription + GPT summary cards with action item extraction.",
      color: "from-neon-pink to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time funnel metrics & ROI charts with predictive insights.",
      color: "from-primary-500 to-neon-blue"
    },
    {
      icon: Zap,
      title: "Integration Hub",
      description: "Google/Outlook calendars, HubSpot, Salesforce with seamless sync.",
      color: "from-accent-500 to-neon-teal"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "AI-powered translation for global outreach campaigns.",
      color: "from-neon-purple to-blue-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption and GDPR compliance.",
      color: "from-green-500 to-neon-teal"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Shared calendars, team analytics, and collaborative workflows.",
      color: "from-neon-blue to-purple-500"
    },
    {
      icon: Target,
      title: "Lead Scoring",
      description: "AI-powered lead qualification with behavioral analysis.",
      color: "from-neon-pink to-orange-500"
    }
  ]

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Powerful</span>
            <span className="gradient-text"> Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to automate your sales process and close more deals
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="group"
            >
              <div className="glass-effect rounded-2xl p-6 h-full card-hover">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-neon-blue/10 via-neon-teal/10 to-neon-purple/10 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="button-primary">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  )
} 