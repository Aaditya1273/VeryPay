import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { Gift, Trophy, Star, Crown, Zap, Target, Calendar, Clock } from 'lucide-react'
import { rewardsAPI } from '@/services/api'
import { useWallet } from '@/contexts/WalletContext'
import toast from 'react-hot-toast'

// Fallback defaults used before API loads
const defaultUserData = {
  totalPoints: 0,
  currentTier: 'Bronze',
  nextTier: 'Silver',
  pointsToNextTier: 1000,
  lifetimeEarned: 0,
  tasksCompleted: 0,
  streak: 0,
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
  const { account } = useWallet()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(defaultUserData)
  const [availableRewards, setAvailableRewards] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  const currentTierData = tiers.find(tier => tier.name === userData.currentTier)
  const nextTierData = tiers.find(tier => tier.name === userData.nextTier)
  const progressToNext = nextTierData && currentTierData
    ? Math.min(100, Math.max(0, ((userData.totalPoints - currentTierData.min) / (nextTierData.min - currentTierData.min)) * 100))
    : 0

  useEffect(() => {
    if (!account) return
    const load = async () => {
      setLoading(true)
      try {
        // User points and eligible rewards
        const userRes = await rewardsAPI.getUser(account)
        const { points, availableRewards } = userRes.data
        setUserData((prev) => ({
          ...prev,
          totalPoints: points || 0,
        }))
        setAvailableRewards(availableRewards || [])

        // Global rewards list (for store)
        const rewardsRes = await rewardsAPI.getRewards()
        const storeRewards = rewardsRes.data?.rewards || []
        // Merge availability based on points and stock
        const enriched = storeRewards.map((r: any) => ({
          ...r,
          available: (r.stock ?? 0) > 0,
          cost: r.pointsCost,
          title: r.name,
          description: r.description,
          icon: '⭐',
        }))
        setAvailableRewards((prev) => {
          // prefer store list as canonical
          return enriched
        })

        // Leaderboard
        const lbRes = await rewardsAPI.getLeaderboard()
        setLeaderboard(lbRes.data?.leaderboard || [])
      } catch (e: any) {
        console.error(e)
        toast.error('Failed to load rewards data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [account])

  const handleRedeem = async (rewardId: number) => {
    if (!account) {
      toast.error('Connect your wallet first')
      return
    }
    try {
      setLoading(true)
      await rewardsAPI.redeem(rewardId, account)
      toast.success('Reward redeemed')
      // Refresh user points and rewards
      const userRes = await rewardsAPI.getUser(account)
      const { points } = userRes.data
      setUserData((prev) => ({ ...prev, totalPoints: points || 0 }))
      const rewardsRes = await rewardsAPI.getRewards()
      const storeRewards = rewardsRes.data?.rewards || []
      const enriched = storeRewards.map((r: any) => ({
        ...r,
        available: (r.stock ?? 0) > 0,
        cost: r.pointsCost,
        title: r.name,
        description: r.description,
        icon: '⭐',
      }))
      setAvailableRewards(enriched)
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to redeem reward')
    } finally {
      setLoading(false)
    }
  }

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
                <div className="text-2xl font-bold">{userData.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{userData.tasksCompleted}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold">{userData.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Tier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Current Tier: {userData.currentTier}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentTierData?.bg} ${currentTierData?.color}`}>
                  {userData.currentTier}
                </div>
                <div className="text-sm text-muted-foreground">
                  {userData.pointsToNextTier} points to {userData.nextTier}
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
                      tier.name === userData.currentTier
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
                {userData.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward: any) => (
              <Card key={reward.id} className={!reward.available ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                      {reward.icon || '⭐'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{reward.title || reward.name}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="text-xl font-bold text-vpay-purple-600">
                        {(reward.cost ?? reward.pointsCost)?.toLocaleString()} points
                      </div>
                      <Button
                        variant={reward.available && userData.totalPoints >= (reward.cost ?? reward.pointsCost) ? "vpay" : "outline"}
                        disabled={loading || !reward.available || userData.totalPoints < (reward.cost ?? reward.pointsCost)}
                        className="w-full"
                        onClick={() => handleRedeem(Number(reward.id))}
                      >
                        {!reward.available ? 'Coming Soon' : 
                         userData.totalPoints < (reward.cost ?? reward.pointsCost) ? 'Insufficient Points' : (loading ? 'Processing...' : 'Claim Reward')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Top Contributors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((u: any) => (
                  <div key={u.rank} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 text-center font-semibold">{u.rank}</div>
                      <div>
                        <div className="font-medium">{u.username || u.address?.slice(0,6)+"..."+u.address?.slice(-4)}</div>
                        <div className="text-xs text-muted-foreground">{u.address}</div>
                      </div>
                    </div>
                    <div className="text-vpay-purple-600 font-semibold">{u.points?.toLocaleString()} pts</div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-sm text-muted-foreground">No leaderboard data yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
