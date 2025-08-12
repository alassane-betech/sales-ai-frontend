"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MessageCircle, FileText } from 'lucide-react'

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    {
      icon: Calendar,
      title: "Embed Your Scheduler",
      description: "Instant 'Share' link or embeddable widget that integrates seamlessly with your existing workflow.",
      color: "from-neon-blue to-primary-500"
    },
    {
      icon: MessageCircle,
      title: "Automate Outreach",
      description: "WhatsApp chatbots, outbound calls & GPT-powered emails that qualify leads 24/7.",
      color: "from-neon-teal to-accent-500"
    },
    {
      icon: FileText,
      title: "AI Meeting Recaps",
      description: "Record, transcribe, summarize, and extract next steps automatically with Whisper + GPT.",
      color: "from-neon-purple to-pink-500"
    }
  ]

  return (
    <section id="how-it-works" className="py-20 relative">
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
            <span className="text-white">How It</span>
            <span className="gradient-text"> Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Three simple steps to transform your sales process with AI-powered automation
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-teal rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Card */}
              <div className="glass-effect rounded-2xl p-8 h-full card-hover">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines between steps */}
        <div className="hidden md:block relative mt-12">
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-neon-blue/30 via-neon-teal/30 to-neon-purple/30 transform -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-neon-blue rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-neon-teal rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  )
} 