import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Gift, Clock, Target, Zap, Crown, Brain, BarChart3 } from 'lucide-react'
import { useAccount } from 'wagmi'
import PersonalizedRewards from '@/components/rewards/PersonalizedRewards'
import RewardAnalyticsDashboard from '@/components/rewards/RewardAnalyticsDashboard'
import axios from 'axios'

interface UserStats {
  totalPoints: number;
  currentTier: string;
  nextTier: string;
  pointsToNextTier: number;
  tasksCompleted: number;
  totalEarnings: number;
  streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: string;
  icon: string;
  available: boolean;
}

const tiers = [
  { name: 'Bronze', min: 0, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { name: 'Silver', min: 1000, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20' },
  { name: 'Gold', min: 3000, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { name: 'Platinum', min: 7500, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  { name: 'Diamond', min: 15000, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' }
]

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isConnected, address } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      fetchRewardsData()
    }
  }, [isConnected, address])

  const fetchRewardsData = async () => {
    try {
      setLoading(true)
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      
      // Fetch user points and stats
      const userResponse = await axios.get(`${API_BASE}/rewards/user/${address}`)
      if (userResponse.data) {
        setUserStats(userResponse.data)
      }
      
      // Fetch achievements
      const achievementsResponse = await axios.get(`${API_BASE}/rewards/achievements`)
      if (achievementsResponse.data) {
        setAchievements(achievementsResponse.data.achievements || [])
      }
      
      // Fetch available rewards
      const rewardsResponse = await axios.get(`${API_BASE}/rewards`)
      if (rewardsResponse.data) {
        setRewards(rewardsResponse.data.rewards || [])
      }
      
      // Fetch leaderboard
      const leaderboardResponse = await axios.get(`${API_BASE}/rewards/leaderboard`)
      if (leaderboardResponse.data) {
        setLeaderboard(leaderboardResponse.data.leaderboard || [])
      }
    } catch (error) {
      console.error('Error fetching rewards data:', error)
      setUserStats({
        totalPoints: 0,
        currentTier: 'Bronze',
        nextTier: 'Silver',
        pointsToNextTier: 100,
        tasksCompleted: 0,
        totalEarnings: 0,
        streak: 0
      })
      setAchievements([])
      setRewards([])
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemReward = async (rewardId: string) => {
    if (!address) return
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      await axios.post(`${API_BASE}/rewards/${rewardId}/redeem`, {
        walletAddress: address
      })
      
      // Refresh data after redemption
      fetchRewardsData()
    } catch (error) {
      console.error('Error redeeming reward:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading rewards data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view rewards and achievements.</p>
        </div>
      </div>
    )
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
          { id: 'ai-rewards', label: 'AI Rewards', icon: Brain },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
                <div className="text-3xl font-bold text-purple-600">{userStats?.totalPoints.toLocaleString() || 0}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{userStats?.tasksCompleted || 0}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{userStats?.currentTier || 'Bronze'}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Tier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Current Tier: {userStats?.currentTier || 'Bronze'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${tiers.find(tier => tier.name === userStats?.currentTier)?.bg} ${tiers.find(tier => tier.name === userStats?.currentTier)?.color}`}>
                  {userStats?.currentTier || 'Bronze'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {userStats?.pointsToNextTier} points to {userStats?.nextTier}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{tiers.find(tier => tier.name === userStats?.currentTier)?.min.toLocaleString()}</span>
                  <span>{tiers.find(tier => tier.name === userStats?.nextTier)?.min.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${userStats ? Math.min(100, Math.max(0, 
                        ((userStats.totalPoints - (tiers.find(tier => tier.name === userStats.currentTier)?.min || 0)) / 
                        ((tiers.find(tier => tier.name === userStats.nextTier)?.min || 1000) - (tiers.find(tier => tier.name === userStats.currentTier)?.min || 0))) * 100
                      )) : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {tiers.map(tier => (
                  <div
                    key={tier.name}
                    className={`text-center p-3 rounded-lg border ${
                      tier.name === userStats?.currentTier
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-2">Activity will appear here when you complete tasks or earn rewards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Rewards Tab */}
      {activeTab === 'ai-rewards' && (
        <div className="space-y-6">
          <PersonalizedRewards />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <RewardAnalyticsDashboard />
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
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
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${achievement.progress || 0}%` }}
                            />
                          </div>
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
                {userStats?.totalPoints.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className={!reward.available ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                      {reward.icon || '⭐'}
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
                        variant={reward.available && (userStats?.totalPoints || 0) >= reward.cost ? "default" : "outline"}
                        disabled={loading || !reward.available || (userStats?.totalPoints || 0) < reward.cost}
                        className="w-full"
                        onClick={() => handleRedeemReward(reward.id)}
                      >
                        {!reward.available ? 'Coming Soon' : 
                         (userStats?.totalPoints || 0) < reward.cost ? 'Insufficient Points' : (loading ? 'Processing...' : 'Claim Reward')}
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
