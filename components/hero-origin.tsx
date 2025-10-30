"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Users, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroOrigin() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] opacity-90"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#007953]/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#00a86b]/40 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">AI-Driven Scheduling &</span>
            <br />
            <span className="bg-gradient-to-r from-[#00a86b] to-[#007953] bg-clip-text text-transparent">
              Outreach, All in One
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[#9D9DA8] mb-8 max-w-3xl mx-auto leading-relaxed">
            Book more calls, qualify leads, and close deals faster with
            intelligent automations
          </p>
        </motion.div>

        {/* CTA Buttons - Origin UI Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          {/* Primary Button - Origin UI Style */}
          <Link
            href="/auth?mode=signup"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#007953] to-[#00a86b] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007953] focus:ring-offset-2 focus:ring-offset-[#18181B]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Button - Origin UI Style */}
          <Button
            variant="outline"
            className="group relative inline-flex items-center justify-center px-8 py-7 text-lg font-medium text-[#007953] border-2 border-[#007953] rounded-xl hover:bg-[#007953] hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007953] focus:ring-offset-2 focus:ring-offset-[#18181B]"
          >
            <Play className="mr-2 h-5 w-5" />
            <span>See It in Action</span>
          </Button>
        </motion.div>

        {/* Stats Grid - Origin UI Card Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* Stat Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-[#1E1E21] backdrop-blur-sm border border-[#232327] p-6 hover:bg-[#232327] transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#007953] to-[#00a86b] rounded-xl mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#007953] to-[#00a86b] bg-clip-text text-transparent mb-2">
              10x
            </div>
            <div className="text-[#9D9DA8] text-sm">
              Faster Lead Qualification
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-[#1E1E21] backdrop-blur-sm border border-[#232327] p-6 hover:bg-[#232327] transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#00a86b] to-[#007953] rounded-xl mb-4 mx-auto">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#00a86b] to-[#007953] bg-clip-text text-transparent mb-2">
              85%
            </div>
            <div className="text-[#9D9DA8] text-sm">More Meetings Booked</div>
          </div>

          {/* Stat Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl bg-[#1E1E21] backdrop-blur-sm border border-[#232327] p-6 hover:bg-[#232327] transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#007953] to-[#007953] rounded-xl mb-4 mx-auto">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#007953] to-[#007953] bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-[#9D9DA8] text-sm">
              AI-Powered Availability
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-[#9D9DA8]"
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm">4.9/5 from 2,000+ reviews</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#232327]"></div>
          <div className="text-sm">Trusted by 10,000+ sales teams</div>
        </motion.div>
      </div>
    </section>
  );
}
