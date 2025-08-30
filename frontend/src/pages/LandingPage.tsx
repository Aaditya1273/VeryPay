import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Wallet, Zap, Shield, Users, Star, TrendingUp, Sparkles, LucideIcon } from 'lucide-react'
import '../styles/animations.css'

const VPayLanding = () => {
  const navigate = useNavigate()
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
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Navbar */}
      <nav className="relative z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 bg-[#5f259f] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-3xl font-semibold text-[#5f259f] tracking-normal">VPay</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#5f259f] hover:text-[#4a1d7a] px-6 py-2 rounded-xl transition-all duration-300 font-semibold"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#5f259f] hover:bg-[#4a1d7a] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
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
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-[#5f259f] hover:bg-[#4a1d7a] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center"
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-3 h-5 w-5" />
                </button>
                
                <button 
                  onClick={() => window.open('https://gamma.app/docs/VPay-Powering-the-Web3-Micro-Economy-a9zlnwnhhqgzp8s', '_blank')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                >
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
      <section id="testimonials" className="relative z-10 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-[#5f259f]">Millions</span>
            </h2>
            <p className="text-xl text-gray-600">See what our users are saying</p>
          </div>
          
          {/* First Row - Left to Right */}
          <div className="relative mb-8">
            <div className="flex animate-scroll-left space-x-6">
              {[
                { name: "Priya Sharma", role: "Small Business Owner", content: "VPay made accepting payments so easy. My customers love the quick checkout!", avatar: "P" },
                { name: "Rahul Kumar", role: "Freelancer", content: "Getting paid internationally was never this simple. VPay is a game-changer.", avatar: "R" },
                { name: "Anita Patel", role: "Student", content: "Splitting expenses with friends is now effortless. Love the user-friendly interface!", avatar: "A" },
                { name: "Vikash Singh", role: "E-commerce Owner", content: "The payment gateway integration was seamless. Our conversion rates improved by 40%!", avatar: "V" },
                { name: "Meera Joshi", role: "Consultant", content: "International clients can now pay me instantly. VPay removed all payment barriers.", avatar: "M" },
                { name: "Arjun Reddy", role: "Startup Founder", content: "VPay's escrow system gave our customers confidence. Trust increased significantly.", avatar: "A" },
                // Duplicate for seamless loop
                { name: "Priya Sharma", role: "Small Business Owner", content: "VPay made accepting payments so easy. My customers love the quick checkout!", avatar: "P" },
                { name: "Rahul Kumar", role: "Freelancer", content: "Getting paid internationally was never this simple. VPay is a game-changer.", avatar: "R" },
                { name: "Anita Patel", role: "Student", content: "Splitting expenses with friends is now effortless. Love the user-friendly interface!", avatar: "A" },
              ].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 testimonial-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#5f259f] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-500 star-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="relative mb-8">
            <div className="flex animate-scroll-right space-x-6">
              {[
                { name: "Deepak Gupta", role: "Restaurant Owner", content: "QR code payments made our service faster. Customers love the convenience!", avatar: "D" },
                { name: "Sneha Kapoor", role: "Fashion Designer", content: "Receiving payments from global clients is now instant. Amazing experience!", avatar: "S" },
                { name: "Ravi Mehta", role: "Tech Lead", content: "The API documentation is excellent. Integration took just 2 hours!", avatar: "R" },
                { name: "Kavya Nair", role: "Photographer", content: "Event payments are so smooth now. Clients pay instantly after shoots.", avatar: "K" },
                { name: "Amit Sharma", role: "Delivery Partner", content: "Daily earnings tracking helps me plan better. VPay is incredibly reliable.", avatar: "A" },
                { name: "Pooja Agarwal", role: "Online Tutor", content: "Students from different countries can pay easily. No more payment delays!", avatar: "P" },
                // Duplicate for seamless loop
                { name: "Deepak Gupta", role: "Restaurant Owner", content: "QR code payments made our service faster. Customers love the convenience!", avatar: "D" },
                { name: "Sneha Kapoor", role: "Fashion Designer", content: "Receiving payments from global clients is now instant. Amazing experience!", avatar: "S" },
                { name: "Ravi Mehta", role: "Tech Lead", content: "The API documentation is excellent. Integration took just 2 hours!", avatar: "R" },
              ].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 testimonial-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#5f259f] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-500 star-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third Row - Left to Right */}
          <div className="relative">
            <div className="flex animate-scroll-left-slow space-x-6">
              {[
                { name: "Manish Jain", role: "Grocery Store Owner", content: "Digital payments increased our daily sales by 60%. VPay is a blessing!", avatar: "M" },
                { name: "Nisha Verma", role: "Yoga Instructor", content: "Students book and pay for classes seamlessly. No more cash handling!", avatar: "N" },
                { name: "Suresh Patel", role: "Taxi Driver", content: "Passengers prefer VPay over cash. My earnings are tracked automatically.", avatar: "S" },
                { name: "Ritika Sood", role: "Event Planner", content: "Vendor payments are instant now. Events run smoother than ever!", avatar: "R" },
                { name: "Karan Malhotra", role: "Gym Owner", content: "Membership renewals are automated. Members love the convenience!", avatar: "K" },
                { name: "Divya Iyer", role: "Boutique Owner", content: "Online and offline payments unified in one platform. Simply amazing!", avatar: "D" },
                // Duplicate for seamless loop
                { name: "Manish Jain", role: "Grocery Store Owner", content: "Digital payments increased our daily sales by 60%. VPay is a blessing!", avatar: "M" },
                { name: "Nisha Verma", role: "Yoga Instructor", content: "Students book and pay for classes seamlessly. No more cash handling!", avatar: "N" },
                { name: "Suresh Patel", role: "Taxi Driver", content: "Passengers prefer VPay over cash. My earnings are tracked automatically.", avatar: "S" },
              ].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 testimonial-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#5f259f] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-500 star-rating">
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
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#5f259f] hover:bg-[#4a1d7a] text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                <Sparkles className="mr-3 w-5 h-5" />
                <span>Download VPay</span>
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
              
              <button 
                onClick={() => navigate('/contact')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* VPay Logo & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#5f259f] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <span className="text-2xl font-semibold text-[#5f259f] tracking-normal">VPay</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Simplifying digital payments for everyone. Send money, pay bills, and manage finances securely.
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#5f259f] hover:text-white cursor-pointer transition-all">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#5f259f] hover:text-white cursor-pointer transition-all">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#5f259f] hover:text-white cursor-pointer transition-all">
                  <span className="text-sm font-bold">in</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#5f259f] hover:text-white cursor-pointer transition-all">
                  <span className="text-sm font-bold">ig</span>
                </div>
              </div>
            </div>

            {/* Business Solutions */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Business Solutions</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Payment Gateway</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Point of Sale</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Business Loans</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Merchant Services</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">QR Code Payments</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Invoice Management</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Analytics Dashboard</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Developer Tools</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Security Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Integration Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Case Studies</a></li>
              </ul>
            </div>

            {/* Instruments */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Instruments</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Credit Cards</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Debit Cards</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">UPI Payments</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Net Banking</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Digital Wallets</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Crypto Payments</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">International Transfer</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Refund Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Compliance</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Grievance Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Regulatory Info</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 text-sm mb-4 md:mb-0">
                <p>&copy; 2025 VPay. All rights reserved. Simplifying digital payments for everyone.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Contact Us</a>
                <a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Support</a>
                <a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Careers</a>
                <a href="#" className="text-gray-600 hover:text-[#5f259f] transition-colors">Press</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default VPayLanding