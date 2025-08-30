import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatAddress } from '@/lib/utils'
import { Wallet, Copy, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WalletConnect() {
  const { 
    account, 
    balance, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    provider,
    signer 
  } = useWallet()
  
  const [copied, setCopied] = useState(false)
  const [networkInfo, setNetworkInfo] = useState(null)

  // Get network information
  useEffect(() => {
    const getNetworkInfo = async () => {
      if (provider) {
        try {
          const network = await provider.getNetwork()
          setNetworkInfo(network)
        } catch (error) {
          console.error('Error getting network info:', error)
        }
      }
    }

    getNetworkInfo()
  }, [provider])

  // Copy address to clipboard
  const copyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account)
        setCopied(true)
        toast.success('Address copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast.error('Failed to copy address')
      }
    }
  }

  // Open address in block explorer
  const openInExplorer = () => {
    if (account && networkInfo) {
      let explorerUrl = ''
      
      // Set explorer URL based on network
      switch (networkInfo.chainId) {
        case 1: // Ethereum Mainnet
          explorerUrl = `https://etherscan.io/address/${account}`
          break
        case 5: // Goerli Testnet
          explorerUrl = `https://goerli.etherscan.io/address/${account}`
          break
        case 11155111: // Sepolia Testnet
          explorerUrl = `https://sepolia.etherscan.io/address/${account}`
          break
        case 137: // Polygon Mainnet
          explorerUrl = `https://polygonscan.com/address/${account}`
          break
        case 80001: // Polygon Mumbai Testnet
          explorerUrl = `https://mumbai.polygonscan.com/address/${account}`
          break
        default:
          toast.error('Block explorer not available for this network')
          return
      }
      
      window.open(explorerUrl, '_blank')
    }
  }

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connectWallet()
      toast.success('Wallet connected successfully!')
    } catch (error) {
      console.error('Connection error:', error)
      toast.error(error.message || 'Failed to connect wallet')
    }
  }

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Disconnection error:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask
  }

  if (!isMetaMaskInstalled()) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span>MetaMask Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            MetaMask wallet is required to use VPay. Please install MetaMask to continue.
          </p>
          <Button 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Wallet className="h-5 w-5 text-purple-600" />
            <span>Connect Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Connect your MetaMask wallet to access VPay features including payments, 
            tasks, and rewards.
          </p>
          
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Make sure MetaMask is unlocked and set to the correct network</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Wallet Connected</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Network Information */}
        {networkInfo && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium">Network:</span>
            <span className="text-sm text-purple-600 dark:text-purple-400">
              {networkInfo.name} (Chain ID: {networkInfo.chainId})
            </span>
          </div>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Wallet Address
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {formatAddress(account)}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyAddress}
              className="shrink-0"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={openInExplorer}
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Balance
          </label>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(parseFloat(balance))}
              </span>
              <span className="text-sm text-purple-600 dark:text-purple-400">
                ETH
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
            onClick={() => window.location.href = '/wallet'}
          >
            <Wallet className="h-4 w-4" />
            <span>View Wallet</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
            onClick={() => window.location.href = '/send'}
          >
            <ExternalLink className="h-4 w-4" />
            <span>Send Payment</span>
          </Button>
        </div>

        {/* Connection Status */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t">
          <p>✅ Securely connected via MetaMask</p>
          <p>Your private keys remain in your wallet</p>
        </div>
      </CardContent>
    </Card>
  )
}
