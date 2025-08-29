import { Outlet } from 'react-router-dom'

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { account, balance, isConnected } = useWallet()

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('vpay-theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('vpay-theme', newTheme ? 'dark' : 'light')
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Tasks', href: '/tasks', icon: Briefcase },
    { name: 'Rewards', href: '/rewards', icon: Gift },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">VPay</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActiveRoute(item.href)
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Balance (if wallet connected) */}
                {isConnected && (
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                    <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {formatCurrency(parseFloat(balance))}
                    </span>
                  </div>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* User Menu */}
                <div className="relative group">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.username || 'User'}
                    </span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {account && (
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Wallet</p>
                          <p className="text-sm font-mono text-gray-900 dark:text-white">
                            {formatAddress(account)}
                          </p>
                        </div>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActiveRoute(item.href)
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}

                {/* Mobile wallet balance */}
                {isConnected && (
                  <div className="flex items-center space-x-3 px-3 py-2 mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                    <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Balance: {formatCurrency(parseFloat(balance))}
                      </p>
                      {account && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                          {formatAddress(account)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="pb-20 p-4">
          <Outlet />
        </main>
        <BottomNav />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-background">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
