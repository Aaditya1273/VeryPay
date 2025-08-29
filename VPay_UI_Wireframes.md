# VPay UI/UX Wireframes & Design System

## Design Theme: Purple-Black / Purple-White

### Color Palette
```css
/* Dark Theme (Purple-Black) */
--primary-purple: #8B5CF6
--secondary-purple: #A78BFA
--accent-purple: #C4B5FD
--background-dark: #0F0F23
--surface-dark: #1A1A2E
--text-light: #F8FAFC
--text-muted: #94A3B8

/* Light Theme (Purple-White) */
--primary-purple: #7C3AED
--secondary-purple: #8B5CF6
--accent-purple: #A78BFA
--background-light: #FFFFFF
--surface-light: #F8FAFC
--text-dark: #1E293B
--text-muted: #64748B
```

---

## Screen Wireframes

### 1. Wallet Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [☰] VPay Wallet                    [🔔] [⚙️] [🌙]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │           💰 Total Balance                  │    │
│  │              1,247.50 VRC                   │    │
│  │         ≈ $1,247.50 USD                     │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   📤 Send    │  │  📥 Receive  │                │
│  │              │  │              │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Quick Actions                               │    │
│  │ [💳 Pay Contact] [📋 Request] [🔄 Exchange] │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Recent Transactions                                │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🟢 +50 VRC  John Doe        2 min ago      │    │
│  │ 🔴 -25 VRC  Coffee Shop     1 hour ago     │    │
│  │ 🟢 +100 VRC Task Reward     3 hours ago    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [View All Transactions]                            │
└─────────────────────────────────────────────────────┘
```

### 2. Send Payment Flow
```
┌─────────────────────────────────────────────────────┐
│ [←] Send Payment                              [✕]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Select Recipient                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🔍 Search contacts...                       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Recent Contacts                                    │
│  ┌─────────────────────────────────────────────┐    │
│  │ 👤 John Doe        [Select]                 │    │
│  │ 👤 Sarah Smith     [Select]                 │    │
│  │ 👤 Mike Johnson    [Select]                 │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Or                                                 │
│  ┌──────────────┐  ┌──────────────┐                │
│  │  📷 Scan QR  │  │  📋 Address  │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                [Continue]                   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ [←] Send to John Doe                          [✕]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 2: Enter Amount                               │
│  ┌─────────────────────────────────────────────┐    │
│  │              50.00 VRC                      │    │
│  │           ≈ $50.00 USD                      │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ [25] [50] [100] [Max: 1,247.50]            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 💬 Add message (optional)                   │    │
│  │ Hey John! Here's your share 😊             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Transaction Details                                │
│  ┌─────────────────────────────────────────────┐    │
│  │ Amount:     50.00 VRC                       │    │
│  │ Fee:        0.01 VRC                        │    │
│  │ Total:      50.01 VRC                       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │           [👆 Confirm Payment]              │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 3. Mini-Jobs Marketplace
```
┌─────────────────────────────────────────────────────┐
│ [☰] Task Marketplace               [🔔] [🔍] [+]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🎯 Recommended for You                      │    │
│  │ Based on your skills: Design, Writing      │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Filters: [All] [Design] [Writing] [Tech] [Other]  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🎨 Logo Design for Startup                  │    │
│  │ 💰 50-100 VRC • ⏱️ 3 days • 📍 Remote      │    │
│  │ Looking for a creative logo designer...    │    │
│  │ ⭐ 4.8 rating • 12 applicants              │    │
│  │                              [Apply Now]   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ ✍️ Blog Article Writing                     │    │
│  │ 💰 30-50 VRC • ⏱️ 2 days • 📍 Remote       │    │
│  │ Need 1000-word article about crypto...     │    │
│  │ ⭐ 4.9 rating • 8 applicants               │    │
│  │                              [Apply Now]   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📱 App Testing & Feedback                   │    │
│  │ 💰 20-30 VRC • ⏱️ 1 day • 📍 Any           │    │
│  │ Test our new mobile app and provide...     │    │
│  │ ⭐ 4.7 rating • 15 applicants              │    │
│  │                              [Apply Now]   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [Load More Tasks]                                  │
└─────────────────────────────────────────────────────┘
```

### 4. Task Creation Flow
```
┌─────────────────────────────────────────────────────┐
│ [←] Create New Task                           [✕]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Basic Information                          │
│  ┌─────────────────────────────────────────────┐    │
│  │ Task Title                                  │    │
│  │ Design a modern logo for my startup        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Category                                    │    │
│  │ [🎨 Design] ▼                              │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Description                                 │    │
│  │ I'm looking for a talented designer to     │    │
│  │ create a modern, minimalist logo for my    │    │
│  │ tech startup. The logo should be...        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Required Skills (select multiple)          │    │
│  │ [✓ Logo Design] [✓ Adobe Illustrator]      │    │
│  │ [✓ Brand Identity] [ Creative Thinking]    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                [Continue]                   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ [←] Create New Task                           [✕]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 2: Budget & Timeline                          │
│  ┌─────────────────────────────────────────────┐    │
│  │ Budget Range                                │    │
│  │ Min: [50] VRC  Max: [100] VRC              │    │
│  │ ≈ $50 - $100 USD                           │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Deadline                                    │    │
│  │ [📅 Select Date] 3 days from now           │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Location Preference                         │    │
│  │ ○ Remote Only                               │    │
│  │ ● Any Location                              │    │
│  │ ○ Specific Location: [Enter City]          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Attachments (optional)                      │    │
│  │ [📎 Add Files] Brand guidelines, examples   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Escrow Details                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Escrow Amount: 110 VRC (includes 10% fee)  │    │
│  │ Released when: Task completed & approved    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │              [Post Task]                    │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 5. Loyalty Rewards Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [☰] Rewards & Achievements            [🔔] [🎁]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🏆 Your Status: Gold Member                │    │
│  │ 🔥 Current Streak: 15 days                 │    │
│  │ ⭐ Total Points: 2,847                     │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Progress to Platinum                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ ████████████░░░░ 75% (2,847/3,000)         │    │
│  │ 153 points to next tier                     │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Today's Opportunities                              │
│  ┌─────────────────────────────────────────────┐    │
│  │ ✅ Daily Login          +2 points          │    │
│  │ ⏳ Send 3 Payments      +6 points (1/3)    │    │
│  │ ⏳ Complete 1 Task      +15 points (0/1)   │    │
│  │ ⏳ Refer a Friend       +50 points         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Recent Achievements                                │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🎯 Task Master      Completed 50 tasks     │    │
│  │ 💰 Big Spender      Spent 1000+ VRC        │    │
│  │ 🤝 Social Butterfly Referred 10 friends    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ 🛍️ Rewards   │  │ 🏅 Badges    │                │
│  │   Store      │  │   Collection │                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

### 6. Profile & Settings
```
┌─────────────────────────────────────────────────────┐
│ [←] Profile                                   [✏️]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │        👤                                   │    │
│  │    John Doe                                 │    │
│  │  @johndoe_vpay                              │    │
│  │                                             │    │
│  │ ⭐ 4.9 Rating • 🏆 Gold Member             │    │
│  │ 📅 Joined March 2024                       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Stats Overview                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 💼 Tasks Completed: 47                      │    │
│  │ 💰 Total Earned: 2,847 VRC                 │    │
│  │ 🤝 Successful Rate: 98%                     │    │
│  │ ⚡ Avg Response: 2 hours                    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Skills & Expertise                                 │
│  ┌─────────────────────────────────────────────┐    │
│  │ [🎨 Design] [✍️ Writing] [💻 Development]   │    │
│  │ [📱 Mobile] [🔍 Research] [+ Add Skill]    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Settings                                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🔐 Security & Privacy                       │    │
│  │ 🔔 Notifications                            │    │
│  │ 🎨 Theme: [🌙 Dark] [☀️ Light]             │    │
│  │ 💰 Payment Preferences                      │    │
│  │ 🌐 Language & Region                        │    │
│  │ ❓ Help & Support                           │    │
│  │ 📋 Terms & Privacy                          │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### Core UI Components

#### 1. VPayCard Component
```jsx
const VPayCard = ({ children, variant = "default", className = "" }) => {
  const baseClasses = "rounded-xl p-4 shadow-lg transition-all duration-200";
  const variants = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    primary: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
```

#### 2. VPayButton Component
```jsx
const VPayButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
    ghost: "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
      ) : null}
      {children}
    </button>
  );
};
```

#### 3. VPayInput Component
```jsx
const VPayInput = ({ 
  label, 
  error, 
  icon, 
  type = "text", 
  className = "",
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          type={type}
          className={`
            block w-full rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            px-3 py-2 ${icon ? 'pl-10' : ''}
            focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
```

#### 4. ThemeToggle Component
```jsx
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
```

### Layout Components

#### 1. Navigation Bar
```jsx
const NavigationBar = ({ title, leftAction, rightActions }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {leftAction}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {rightActions}
        </div>
      </div>
    </header>
  );
};
```

#### 2. Bottom Tab Navigation
```jsx
const BottomTabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'wallet', icon: '💰', label: 'Wallet' },
    { id: 'tasks', icon: '💼', label: 'Tasks' },
    { id: 'rewards', icon: '🏆', label: 'Rewards' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];
  
  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
```

---

## Design Patterns & Guidelines

### 1. Spacing System
```css
/* Consistent spacing scale */
.space-xs { margin: 0.25rem; }    /* 4px */
.space-sm { margin: 0.5rem; }     /* 8px */
.space-md { margin: 1rem; }       /* 16px */
.space-lg { margin: 1.5rem; }     /* 24px */
.space-xl { margin: 2rem; }       /* 32px */
.space-2xl { margin: 3rem; }      /* 48px */
```

### 2. Typography Scale
```css
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */
.text-2xl { font-size: 1.5rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; }  /* 30px */
```

### 3. Animation Guidelines
```css
/* Smooth transitions for all interactive elements */
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Success animations */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
}
```

### 4. Responsive Breakpoints
```css
/* Mobile-first responsive design */
.container {
  width: 100%;
  padding: 0 1rem;
}

@media (min-width: 640px) {  /* sm */
  .container { max-width: 640px; }
}

@media (min-width: 768px) {  /* md */
  .container { max-width: 768px; }
}

@media (min-width: 1024px) { /* lg */
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) { /* xl */
  .container { max-width: 1280px; }
}
```

### 5. Accessibility Features
- **High Contrast**: Ensure 4.5:1 contrast ratio minimum
- **Focus Indicators**: Visible focus rings for keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Touch Targets**: Minimum 44px touch target size
- **Reduced Motion**: Respect `prefers-reduced-motion` setting

### 6. Micro-Interactions
- **Button Press**: Scale down slightly on press (transform: scale(0.98))
- **Card Hover**: Subtle elevation increase (shadow-lg → shadow-xl)
- **Input Focus**: Smooth border color transition and subtle glow
- **Success States**: Green checkmark with bounce animation
- **Loading States**: Skeleton screens and spinner animations

This design system ensures VPay maintains a consistent, modern, and accessible interface across all platforms while providing smooth user experiences that encourage engagement and trust.
