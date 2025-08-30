import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWallet } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAddress, formatCurrency } from '@/lib/utils'
import { User, Wallet, Shield, Bell, Palette, LogOut, Edit, Camera, Star, Award } from 'lucide-react'
import toast from 'react-hot-toast'

// Mock user profile data
const mockProfile = {
  username: 'john_doe',
  email: 'john@example.com',
  fullName: 'John Doe',
  bio: 'Freelance designer and developer passionate about creating amazing user experiences.',
  avatar: '👨‍💻',
  joinedDate: '2024-01-15',
  completedTasks: 23,
  rating: 4.8,
  totalEarned: 2450,
  skills: ['UI/UX Design', 'React', 'Node.js', 'Graphic Design'],
  isVerified: true,
  kycStatus: 'approved'
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: mockProfile.fullName,
    bio: mockProfile.bio,
    skills: mockProfile.skills.join(', ')
  })

  const { user, logout } = useAuth()
  const { account, balance, disconnectWallet } = useWallet()

  const handleSave = () => {
    // Simulate API call
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    await disconnectWallet()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl">
                {mockProfile.avatar}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold">{mockProfile.fullName}</h2>
                {mockProfile.isVerified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-2">@{mockProfile.username}</p>
              <p className="text-sm text-muted-foreground mb-4">{mockProfile.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{mockProfile.completedTasks}</div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{mockProfile.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{formatCurrency(mockProfile.totalEarned)}</div>
                  <div className="text-xs text-muted-foreground">Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">Silver</div>
                  <div className="text-xs text-muted-foreground">Tier</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'preferences', label: 'Preferences', icon: Palette }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-vpay-purple-600 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <Button variant="vpay" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="font-medium">@{mockProfile.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="font-medium">{mockProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="font-medium">{mockProfile.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                      <p className="font-medium">{new Date(mockProfile.joinedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bio</label>
                    <p className="font-medium">{mockProfile.bio}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {mockProfile.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-vpay-purple-100 dark:bg-vpay-purple-900/20 text-vpay-purple-700 dark:text-vpay-purple-300 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Verification Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Identity Verification</p>
                    <p className="text-sm text-muted-foreground">KYC verification completed</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full">
                  Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Wallet Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {account ? (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Connected Wallet</p>
                    <p className="text-sm text-muted-foreground font-mono">{formatAddress(account)}</p>
                    <p className="text-sm text-muted-foreground">Balance: {formatCurrency(parseFloat(balance))}</p>
                  </div>
                  <Button variant="outline" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No wallet connected</p>
                  <Button variant="vpay">Connect Wallet</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Task Updates', description: 'Get notified about task applications and completions', enabled: true },
                { label: 'Payment Notifications', description: 'Receive alerts for incoming and outgoing payments', enabled: true },
                { label: 'Reward Notifications', description: 'Get notified about new rewards and achievements', enabled: true },
                { label: 'Marketing Emails', description: 'Receive updates about new features and promotions', enabled: false },
                { label: 'Weekly Summary', description: 'Get a weekly summary of your activity', enabled: true }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Button
                    variant={setting.enabled ? "vpay" : "outline"}
                    size="sm"
                  >
                    {setting.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Dark Mode', description: 'Toggle between light and dark themes', type: 'toggle' },
                { label: 'Language', description: 'Choose your preferred language', type: 'select', value: 'English' },
                { label: 'Currency Display', description: 'Choose how to display currency values', type: 'select', value: 'VRC' },
                { label: 'Auto-refresh', description: 'Automatically refresh data every 30 seconds', type: 'toggle' }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  {setting.type === 'toggle' ? (
                    <Button variant="outline" size="sm">Toggle</Button>
                  ) : (
                    <select className="px-3 py-1 border border-input rounded-md bg-background text-foreground text-sm">
                      <option>{setting.value}</option>
                    </select>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <p className="font-medium text-red-600">Sign Out</p>
                    <p className="text-sm text-muted-foreground">Sign out of your account</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
