"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "ShowUp transformed our demo booking process. We're now booking 3x more meetings with qualified leads.",
      author: "Sarah Chen",
      role: "VP of Sales",
      company: "TechFlow Inc.",
      useCase: "Startups boosting demo bookings",
      rating: 5,
    },
    {
      quote:
        "The WhatsApp automation is incredible. Our consultants can focus on high-value conversations while AI handles the rest.",
      author: "Michael Rodriguez",
      role: "Managing Partner",
      company: "Growth Consulting",
      useCase: "Consultancies automating follow-ups",
      rating: 5,
    },
    {
      quote:
        "Meeting intelligence feature saves us hours every week. The AI summaries are spot-on and actionable.",
      author: "Emily Watson",
      role: "Sales Director",
      company: "Digital Agency Pro",
      useCase: "Agencies scaling outreach",
      rating: 5,
    },
    {
      quote:
        "The integration with our existing tools was seamless. ROI was visible within the first month.",
      author: "David Kim",
      role: "Head of Growth",
      company: "SaaS Startup",
      useCase: "Startups boosting demo bookings",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 relative">
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
            <span className="text-white">Trusted by</span>
            <span className="gradient-text"> Teams</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See how different organizations are transforming their sales process
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-neon-blue/10 via-transparent to-transparent rounded-3xl" />

          {/* Testimonial Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="glass-effect rounded-3xl p-8 md:p-12 relative"
          >
            {/* Use case badge */}
            <div className="inline-block bg-gradient-to-r from-neon-blue/20 to-neon-teal/20 text-neon-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
              {testimonials[currentIndex].useCase}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
              "{testimonials[currentIndex].quote}"
            </blockquote>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-teal rounded-full flex items-center justify-center text-white font-bold">
                {testimonials[currentIndex].author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="ml-4">
                <div className="text-white font-semibold">
                  {testimonials[currentIndex].author}
                </div>
                <div className="text-gray-400 text-sm">
                  {testimonials[currentIndex].role} at{" "}
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-neon-blue scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Use Cases Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            {
              title: "Startups",
              description: "Boost demo bookings and qualify leads faster",
              gradient: "from-neon-blue to-primary-500",
            },
            {
              title: "Consultancies",
              description: "Automate follow-ups and scale client acquisition",
              gradient: "from-neon-teal to-accent-500",
            },
            {
              title: "Agencies",
              description:
                "Scale outreach and manage multiple client campaigns",
              gradient: "from-neon-purple to-pink-500",
            },
          ].map((useCase, index) => (
            <div key={useCase.title} className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${useCase.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-white font-bold text-xl">
                  {useCase.title[0]}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-gray-400">{useCase.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
