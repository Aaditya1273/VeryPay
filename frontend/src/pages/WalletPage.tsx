import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatAddress, formatRelativeTime } from '@/lib/utils'
import { Send, Download, QrCode, Eye, EyeOff, Copy, ExternalLink, Loader2 } from 'lucide-react'
import { walletAPI } from '@/services/api'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  type: 'sent' | 'received'
  amount: number
  from: string
  to: string
  message?: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
  hash: string
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { balance, account, isConnected, connectWallet } = useWallet()

  useEffect(() => {
    if (isConnected) {
      fetchTransactions()
    }
  }, [isConnected])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await walletAPI.getTransactions({ limit: 10 })
      setTransactions(response.data.transactions || [])
    } catch (err: any) {
      setError('Failed to load transactions')
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      toast.success('Address copied to clipboard')
    }
  }

  const totalBalance = parseFloat(balance)

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Connect your wallet to get started</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="w-20 h-20 bg-gradient-to-r from-vpay-purple-500 to-vpay-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your Web3 wallet to start sending and receiving payments
            </p>
            <Button variant="vpay" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your VRC tokens and transactions</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-vpay-purple-500 to-vpay-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Total Balance</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                {showBalance ? formatCurrency(totalBalance) : '••••••'}
              </div>
              <div className="text-white/80">
                {showBalance && totalBalance > 0 ? `≈ $${(totalBalance * 1.0).toFixed(2)} USD` : showBalance ? '$0.00 USD' : '••••••'}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <span>Address:</span>
              <span className="font-mono">{formatAddress(account!)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/send">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center space-y-2 p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Send</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/receive">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center space-y-2 p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Receive</span>
            </CardContent>
          </Card>
        </Link>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            if (account) {
              navigator.clipboard.writeText(account)
              toast.success('QR code functionality coming soon!')
            }
          }}
        >
          <CardContent className="flex flex-col items-center space-y-2 p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <QrCode className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-medium">QR Code</span>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            if (account) {
              window.open(`https://etherscan.io/address/${account}`, '_blank')
            } else {
              toast.error('Please connect your wallet first')
            }
          }}
        >
          <CardContent className="flex flex-col items-center space-y-2 p-6">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="font-medium">Explorer</span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" onClick={() => {
              toast.success('Full transaction history coming soon!')
            }}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-vpay-purple-600" />
              <span className="ml-2 text-muted-foreground">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button variant="outline" onClick={fetchTransactions}>
                Try Again
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start using VPay to see your transaction history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'received' 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {tx.type === 'received' ? (
                      <Download className={`h-5 w-5 text-green-600 dark:text-green-400`} />
                    ) : (
                      <Send className={`h-5 w-5 text-red-600 dark:text-red-400`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {tx.type === 'received' ? `From ${formatAddress(tx.from)}` : `To ${formatAddress(tx.to)}`}
                      </p>
                      <span className={`font-semibold ${
                        tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'received' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                    {tx.message && (
                      <p className="text-sm text-muted-foreground truncate">{tx.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(tx.timestamp)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'confirmed' ? 'bg-green-500' : 
                      tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
