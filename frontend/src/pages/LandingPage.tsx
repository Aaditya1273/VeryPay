import { useState, useEffect } from 'react'
import { ArrowRight, Wallet, Zap, Shield, Users, Star, TrendingUp, Sparkles, LucideIcon } from 'lucide-react'

const VPayLanding = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
    hero: false,
    stats: false,
    features: false,
    testimonials: false,
    cta: false
  })

  useEffect(() => {

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



    // Observe sections
    const sections = document.querySelectorAll('[id]')
    sections.forEach(section => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  const features: Array<{
    icon: LucideIcon;
    title: string;
    desc: string;
  }> = [
    { icon: Zap, title: "Instant Transfers", desc: "Send money instantly to anyone, anywhere" },
    { icon: Shield, title: "Bank-Level Security", desc: "Your money is protected with advanced encryption" },
    { icon: Wallet, title: "Digital Wallet", desc: "Store, manage and spend your money digitally" },
    { icon: Users, title: "Easy Splitting", desc: "Split bills and expenses with friends effortlessly" }
  ]

  const stats = [
    { value: "$50B+", label: "Total Volume", icon: TrendingUp },
    { value: "2M+", label: "Global Users", icon: Users },
    { value: "0.01%", label: "Transaction Fee", icon: Wallet },
    { value: "99.99%", label: "Uptime", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5f259f] via-[#7c3aed] to-[#5f259f] overflow-hidden relative">
      {/* Clean Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#5f259f] to-[#7c3aed]">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 bg-[#5f259f] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">V</span>
              </div>
              <span className="text-3xl font-black text-[#5f259f]">VPay</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-[#5f259f] hover:text-[#4a1d7a] px-6 py-2 rounded-xl transition-all duration-300 font-semibold">
                Sign In
              </button>
              <button className="bg-[#5f259f] hover:bg-[#4a1d7a] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`bg-white rounded-3xl shadow-2xl p-12 md:p-16 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-[#5f259f]/10 rounded-full px-6 py-3 mb-8">
                <Sparkles className="w-5 h-5 text-[#5f259f]" />
                <span className="text-[#5f259f] font-semibold">Trusted Digital Payments</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="block">Simple, Secure</span>
                <span className="block text-[#5f259f]">
                  Digital Payments
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Experience seamless digital transactions with bank-level security. 
                Send money, pay bills, and manage finances - all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-[#5f259f] hover:bg-[#4a1d7a] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center">
                  <span>Get Started</span>
                  <ArrowRight className="ml-3 h-5 w-5" />
                </button>
                
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-[#5f259f]/10 rounded-2xl p-6 mb-4 group-hover:bg-[#5f259f]/20 transition-all duration-300">
                    <stat.icon className="w-10 h-10 text-[#5f259f] mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-[#5f259f]">VPay</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need for modern digital payments
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-[#5f259f]/10 rounded-2xl p-6 mb-6 group-hover:bg-[#5f259f]/20 transition-all duration-300">
                    <feature.icon className="w-12 h-12 text-[#5f259f] mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trusted by <span className="text-[#5f259f]">Millions</span>
              </h2>
              <p className="text-xl text-gray-600">See what our users are saying</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Priya Sharma", role: "Small Business Owner", content: "VPay made accepting payments so easy. My customers love the quick checkout!" },
                { name: "Rahul Kumar", role: "Freelancer", content: "Getting paid internationally was never this simple. VPay is a game-changer." },
                { name: "Anita Patel", role: "Student", content: "Splitting expenses with friends is now effortless. Love the user-friendly interface!" }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#5f259f] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-16 text-center transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Start Your <span className="text-[#5f259f]">Digital Journey</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Join millions of users who trust VPay for secure, instant digital payments. 
              Download the app and get started in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#5f259f] hover:bg-[#4a1d7a] text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center">
                <Sparkles className="mr-3 w-5 h-5" />
                <span>Download VPay</span>
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
              
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="w-12 h-12 bg-[#5f259f] rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">V</span>
                </div>
                <span className="text-3xl font-black text-[#5f259f]">VPay</span>
              </div>
              
              <div className="text-gray-600 text-center">
                <p>&copy; 2025 VPay. Simplifying digital payments for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default VPayLanding