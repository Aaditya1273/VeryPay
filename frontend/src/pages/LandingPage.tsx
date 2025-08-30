import React, { useState, useEffect } from 'react'
import { ArrowRight, Wallet, Zap, Shield, Users, Star, CheckCircle, TrendingUp, Globe, Lock, Sparkles, Play, Pause, LucideIcon } from 'lucide-react'

const VPayLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
    hero: false,
    stats: false,
    features: false,
    testimonials: false,
    cta: false
  })
  const [activeFeature, setActiveFeature] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => setScrollY(window.scrollY)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1 }
    )

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', handleScroll)

    // Auto-cycle features
    const interval = setInterval(() => {
      if (isPlaying) {
        setActiveFeature(prev => (prev + 1) % 4)
      }
    }, 3000)

    // Observe sections
    const sections = document.querySelectorAll('[id]')
    sections.forEach(section => observer.observe(section))

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
      observer.disconnect()
    }
  }, [isPlaying])

  const features: Array<{
    icon: LucideIcon;
    title: string;
    desc: string;
    color: string;
  }> = [
    { icon: Zap, title: "Lightning Speed", desc: "Process transactions in under 0.5 seconds", color: "from-yellow-400 to-orange-500" },
    { icon: Shield, title: "Military Security", desc: "Advanced quantum-resistant encryption", color: "from-blue-400 to-cyan-500" },
    { icon: Globe, title: "Global Reach", desc: "Available in 150+ countries worldwide", color: "from-green-400 to-emerald-500" },
    { icon: TrendingUp, title: "Smart Analytics", desc: "AI-powered insights and predictions", color: "from-purple-400 to-pink-500" }
  ]

  const stats = [
    { value: "$50B+", label: "Total Volume", icon: TrendingUp },
    { value: "2M+", label: "Global Users", icon: Users },
    { value: "0.01%", label: "Transaction Fee", icon: Wallet },
    { value: "99.99%", label: "Uptime", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/50 via-black to-indigo-900/50">
        <div className="absolute inset-0">
          {/* Floating particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Mouse follower gradient */}
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-300">
                  <span className="text-white font-black text-xl">V</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <span className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">VPay</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-white/70 hover:text-white hover:bg-white/10 px-6 py-2 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-200 font-medium">Next-Gen Web3 Payments</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              <span className="block">The Future is</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Decentralized
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary Web3 payment infrastructure that combines lightning-fast transactions, 
              military-grade security, and seamless user experience. Join the financial revolution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center">
                <span>Launch App</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating dashboard preview */}
        <div className={`absolute top-1/2 right-10 w-80 h-48 transform transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                <div>
                  <div className="w-20 h-3 bg-white/30 rounded mb-1" />
                  <div className="w-16 h-2 bg-white/20 rounded" />
                </div>
              </div>
              <div className="text-green-400 font-bold">+$2,450</div>
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="w-24 h-2 bg-white/20 rounded" />
                  <div className="w-12 h-2 bg-purple-400/50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section id="stats" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                  <stat.icon className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-white/60 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the most advanced Web3 payment platform with cutting-edge technology
            </p>
            
            {/* Feature controls */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature showcase */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex space-x-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveFeature(index)
                          setIsPlaying(false)
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeFeature 
                            ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-125' 
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`w-24 h-24 bg-gradient-to-r ${features[activeFeature].color} rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform hover:scale-110 hover:rotate-12`}>
                    {React.createElement(features[activeFeature].icon, { className: "w-12 h-12 text-white" })}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{features[activeFeature].title}</h3>
                  <p className="text-white/70 text-lg">{features[activeFeature].desc}</p>
                </div>
              </div>
            </div>
            
            {/* Feature list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setActiveFeature(index)
                    setIsPlaying(false)
                  }}
                  className={`group cursor-pointer p-6 rounded-2xl transition-all duration-500 ${
                    index === activeFeature
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 scale-105'
                      : 'bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-white/60">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl font-black text-white mb-6">
              Trusted by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Millions</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "DeFi Trader", content: "VPay revolutionized how I manage my crypto portfolio. The speed is incredible!" },
              { name: "Marcus Rodriguez", role: "Web3 Developer", content: "Integration was seamless. Best payment infrastructure I've worked with." },
              { name: "Emily Watson", role: "Digital Nomad", content: "Finally, a payment solution that works globally without the fees!" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">{testimonial.name}</div>
                    <div className="text-white/60">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-2xl">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Transform</span> Finance?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Join over 2 million users who trust VPay for their Web3 payment needs. 
                The future of finance starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center">
                  <Sparkles className="mr-3 w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Start Your Journey</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
                
                <button className="bg-white text-purple-600 hover:bg-purple-50 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-xl">V</span>
              </div>
              <span className="text-3xl font-black text-white">VPay</span>
            </div>
            
            <div className="text-white/60 text-center">
              <p>&copy; 2025 VPay. Building the future of Web3 payments.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}

export default VPayLanding