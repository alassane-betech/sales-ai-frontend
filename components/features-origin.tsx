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
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export function FeaturesOrigin() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Timezone-aware slots, buffer times, auto-reminders with intelligent conflict resolution.",
      color: "from-green-main to-green-light",
      gradient: "from-green-main/20 to-green-light/20"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp AI Flows",
      description: "Qualification via chat + VoIP dialing with natural language processing.",
      color: "from-green-light to-green-main",
      gradient: "from-green-light/20 to-green-main/20"
    },
    {
      icon: Mail,
      title: "Email Sequences",
      description: "Dynamic templates with subject-line A/B tests and personalized content generation.",
      color: "from-green-main to-green-dark",
      gradient: "from-green-main/20 to-green-dark/20"
    },
    {
      icon: Mic,
      title: "Meeting Intelligence",
      description: "Whisper transcription + GPT summary cards with action item extraction.",
      color: "from-green-light to-green-main",
      gradient: "from-green-light/20 to-green-main/20"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time funnel metrics & ROI charts with predictive insights.",
      color: "from-green-main to-green-light",
      gradient: "from-green-main/20 to-green-light/20"
    },
    {
      icon: Zap,
      title: "Integration Hub",
      description: "Google/Outlook calendars, HubSpot, Salesforce with seamless sync.",
      color: "from-green-light to-green-main",
      gradient: "from-green-light/20 to-green-main/20"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "AI-powered translation for global outreach campaigns.",
      color: "from-green-main to-green-dark",
      gradient: "from-green-main/20 to-green-dark/20"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption and GDPR compliance.",
      color: "from-green-light to-green-main",
      gradient: "from-green-light/20 to-green-main/20"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Shared calendars, team analytics, and collaborative workflows.",
      color: "from-green-main to-green-light",
      gradient: "from-green-main/20 to-green-light/20"
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-main/20 to-green-light/20 text-green-main rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Everything you need to</span>
            <br />
            <span className="bg-gradient-to-r from-green-main to-green-light bg-clip-text text-transparent">
              automate your sales
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powerful AI tools that work together to streamline your entire sales process
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="group relative"
            >
              {/* Feature Card - Origin UI Style */}
              <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 h-full hover:bg-white/10 transition-all duration-300 hover:scale-105">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-green-main group-hover:to-green-light group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed text-sm mb-4">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="flex items-center text-green-main group-hover:text-green-light transition-colors duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-main/30 transition-all duration-300" />
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
          <div className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-green-main to-green-light rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2 focus:ring-offset-dark-900">
            <span>Explore All Features</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        </motion.div>
      </div>
    </section>
  )
} 