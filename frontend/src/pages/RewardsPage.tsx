import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { Gift, Trophy, Star, Crown, Zap, Target, Calendar, Clock } from 'lucide-react'

// Mock user data
const mockUserData = {
  totalPoints: 2450,
  currentTier: 'Silver',
  nextTier: 'Gold',
  pointsToNextTier: 550,
  lifetimeEarned: 5200,
  tasksCompleted: 23,
  streak: 7
}

// Mock achievements
const mockAchievements = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: '🎯',
    points: 50,
    unlocked: true,
    unlockedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Connect your wallet',
    icon: '🦋',
    points: 25,
    unlocked: true,
    unlockedAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '⚡',
    points: 100,
    unlocked: true,
    unlockedAt: '2024-01-20'
  },
  {
    id: '4',
    title: 'Streak Champion',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    points: 150,
    unlocked: true,
    unlockedAt: '2024-01-22'
  },
  {
    id: '5',
    title: 'Big Spender',
    description: 'Spend 1000 VRC tokens',
    icon: '💎',
    points: 200,
    unlocked: false,
    progress: 65
  },
  {
    id: '6',
    title: 'Community Leader',
    description: 'Help 50 community members',
    icon: '👑',
    points: 500,
    unlocked: false,
    progress: 20
  }
]

// Mock rewards store
const mockRewards = [
  {
    id: '1',
    title: 'VRC Token Bonus',
    description: '10 free VRC tokens',
    cost: 500,
    type: 'token',
    icon: '🪙',
    available: true
  },
  {
    id: '2',
    title: 'Premium Badge',
    description: 'Show off your status',
    cost: 200,
    type: 'badge',
    icon: '⭐',
    available: true
  },
  {
    id: '3',
    title: 'Task Priority Boost',
    description: 'Get featured in task listings',
    cost: 300,
    type: 'boost',
    icon: '🚀',
    available: true
  },
  {
    id: '4',
    title: 'Custom Profile Theme',
    description: 'Personalize your profile',
    cost: 150,
    type: 'theme',
    icon: '🎨',
    available: true
  },
  {
    id: '5',
    title: 'VIP Support',
    description: '24/7 priority customer support',
    cost: 1000,
    type: 'service',
    icon: '💼',
    available: false
  },
  {
    id: '6',
    title: 'Exclusive NFT',
    description: 'Limited edition VPay NFT',
    cost: 2000,
    type: 'nft',
    icon: '🖼️',
    available: false
  }
]

// Tier information
const tiers = [
  { name: 'Bronze', min: 0, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { name: 'Silver', min: 1000, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20' },
  { name: 'Gold', min: 3000, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { name: 'Platinum', min: 7500, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  { name: 'Diamond', min: 15000, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' }
]

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'store'>('overview')

  const currentTierData = tiers.find(tier => tier.name === mockUserData.currentTier)
  const nextTierData = tiers.find(tier => tier.name === mockUserData.nextTier)
  const progressToNext = nextTierData ? 
    ((mockUserData.totalPoints - (currentTierData?.min || 0)) / (nextTierData.min - (currentTierData?.min || 0))) * 100 
    : 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Rewards & Loyalty</h1>
        <p className="text-muted-foreground">Earn points, unlock achievements, and claim rewards</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Gift },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'store', label: 'Rewards Store', icon: Star }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Points Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-vpay-purple-100 dark:bg-vpay-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-vpay-purple-600" />
                </div>
                <div className="text-2xl font-bold">{mockUserData.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{mockUserData.tasksCompleted}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold">{mockUserData.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Tier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Current Tier: {mockUserData.currentTier}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentTierData?.bg} ${currentTierData?.color}`}>
                  {mockUserData.currentTier}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mockUserData.pointsToNextTier} points to {mockUserData.nextTier}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentTierData?.min.toLocaleString()}</span>
                  <span>{nextTierData?.min.toLocaleString()}</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {tiers.map(tier => (
                  <div
                    key={tier.name}
                    className={`text-center p-3 rounded-lg border ${
                      tier.name === mockUserData.currentTier
                        ? 'border-vpay-purple-500 bg-vpay-purple-50 dark:bg-vpay-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`text-sm font-medium ${tier.color}`}>{tier.name}</div>
                    <div className="text-xs text-muted-foreground">{tier.min.toLocaleString()}+</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Completed task "Logo Design"', points: 150, time: '2 hours ago' },
                  { action: 'Daily login bonus', points: 10, time: '1 day ago' },
                  { action: 'Achievement unlocked: Streak Champion', points: 150, time: '1 day ago' },
                  { action: 'Completed task "Data Entry"', points: 50, time: '2 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className="text-green-600 font-semibold">+{activity.points}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAchievements.map(achievement => (
              <Card key={achievement.id} className={achievement.unlocked ? 'border-green-200 dark:border-green-800' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      achievement.unlocked ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      
                      {achievement.unlocked ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium">+{achievement.points} points</span>
                          <span className="text-xs text-muted-foreground">
                            Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                          <div className="text-sm text-muted-foreground">
                            Reward: {achievement.points} points
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Store Tab */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Rewards Store</h2>
              <p className="text-muted-foreground">Spend your points on exclusive rewards</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-vpay-purple-600">
                {mockUserData.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRewards.map(reward => (
              <Card key={reward.id} className={!reward.available ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                      {reward.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="text-xl font-bold text-vpay-purple-600">
                        {reward.cost.toLocaleString()} points
                      </div>
                      <Button
                        variant={reward.available && mockUserData.totalPoints >= reward.cost ? "vpay" : "outline"}
                        disabled={!reward.available || mockUserData.totalPoints < reward.cost}
                        className="w-full"
                      >
                        {!reward.available ? 'Coming Soon' : 
                         mockUserData.totalPoints < reward.cost ? 'Insufficient Points' : 'Claim Reward'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
