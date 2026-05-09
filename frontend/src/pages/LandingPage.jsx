import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiTrendingUp, FiVideo, FiUsers, FiCpu } from 'react-icons/fi';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-dark py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <FiCpu className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold text-gradient">SmartPresence AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-accent transition-colors">How it Works</a>
          <a href="#analytics" className="hover:text-accent transition-colors">Analytics</a>
          <Link to="/login" className="px-6 py-2 rounded-full glass border border-white/10 hover:bg-white/10 transition-all">Login</Link>
          <Link to="/register" className="px-6 py-2 rounded-full btn-primary-custom text-white shadow-lg shadow-primary/30">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow"></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <span className="px-4 py-2 rounded-full glass border border-white/10 text-accent text-sm font-semibold mb-6 inline-block">
            Next-Gen AI Classroom Monitoring
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Intelligent Attendance & <br />
            <span className="text-gradient">Student Engagement</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Eliminate proxy attendance and monitor student behavior in real-time with our advanced AI-powered platform. Built for the future of education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 rounded-xl btn-primary-custom text-lg font-bold shadow-xl">Get Started Free</Link>
            <button className="px-10 py-4 rounded-xl glass border border-white/10 text-lg font-bold hover:bg-white/5 transition-all">Explore Demo</button>
          </div>
        </motion.div>

        {/* Floating AI Dashboard Preview */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 relative z-10 w-full max-w-5xl mx-auto"
        >
          <div className="glass rounded-3xl p-4 border border-white/20 shadow-2xl overflow-hidden">
             <div className="aspect-video bg-dark-lighter rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FiVideo className="text-6xl text-primary mb-4 mx-auto animate-bounce" />
                    <p className="text-gray-500 font-mono">INITIALIZING AI SCANNER...</p>
                  </div>
                </div>
                {/* Mock Face Recognition Boxes */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-accent/50 rounded-lg">
                  <div className="bg-accent text-dark font-bold text-[10px] px-1 absolute -top-4">ID: 9842 (Verified)</div>
                </div>
                <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-primary/50 rounded-lg">
                   <div className="bg-primary text-white font-bold text-[10px] px-1 absolute -top-4">ID: 1024 (Active)</div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cutting-Edge Features</h2>
            <p className="text-gray-400">Everything you need to maintain classroom integrity and track performance.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <FiShield />, title: "Proxy Prevention", desc: "AI-powered face recognition ensures only the registered student is present." },
              { icon: <FiTrendingUp />, title: "Engagement Tracking", desc: "Monitor eye movement, head pose, and activity to calculate focus scores." },
              { icon: <FiVideo />, title: "Live Monitoring", desc: "Real-time dashboard for teachers to see all students' live status." },
              { icon: <FiCheckCircle />, title: "Liveness Detection", desc: "Prevents bypass using photos or videos through blink and depth analysis." },
              { icon: <FiUsers />, title: "Bulk Attendance", desc: "Automated attendance logging with zero manual intervention required." },
              { icon: <FiCpu />, title: "Smart Alerts", desc: "Instant notifications for suspicious activities like tab switching or multiple faces." }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="glass p-8 rounded-3xl border border-white/5 card-hover">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 border-y border-white/5 bg-gradient-to-b from-dark/50 to-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500K+", label: "Faces Verified" },
            { value: "99.9%", label: "Accuracy Rate" },
            { value: "10K+", label: "Active Classrooms" },
            { value: "24/7", label: "Real-time Monitoring" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-4xl md:text-5xl font-extrabold text-gradient mb-2">{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Simplified Workflow</span>
            <h2 className="text-4xl font-bold mb-4">How SmartPresence Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From registration to real-time tracking, our platform makes intelligent monitoring effortless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 -z-10"></div>

            {[
              { step: "01", title: "Enroll Biometrics", desc: "Students register their face data securely using our multi-angle enrollment system." },
              { step: "02", title: "Join Session", desc: "Teachers start a live class, and students join. The AI scanner instantly verifies identity." },
              { step: "03", title: "Live Tracking", desc: "Our engine continuously monitors engagement, liveness, and suspicious activities in the background." }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-24 h-24 mx-auto glass rounded-full flex items-center justify-center border-2 border-white/10 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to revolutionize your classroom?</h2>
            <p className="text-xl text-gray-400 mb-10">Join thousands of educators using SmartPresence AI to enhance academic integrity.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register" className="px-12 py-4 rounded-2xl btn-primary-custom text-xl font-bold shadow-2xl">Create Account</Link>
              <Link to="/login" className="px-12 py-4 rounded-2xl glass border border-white/10 text-xl font-bold hover:bg-white/5 transition-all">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <FiCpu className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-gradient">SmartPresence AI</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 SmartPresence AI. All rights reserved.</p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
