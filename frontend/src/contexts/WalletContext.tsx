import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

interface WalletContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  account: string | null
  balance: string
  isConnected: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [isConnecting, setIsConnecting] = useState(false)

  const isConnected = !!account

  useEffect(() => {
    checkConnection()
    setupEventListeners()
  }, [])

  useEffect(() => {
    if (account && provider) {
      updateBalance()
    }
  }, [account, provider])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          setProvider(provider)
          const signer = await provider.getSigner()
          setSigner(signer)
          setAccount(accounts[0].address)
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }
  }

  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask to use VPay')
      return
    }

    try {
      setIsConnecting(true)
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      
      toast.success('Wallet connected successfully!')
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      if (error.code === 4001) {
        toast.error('Please connect your wallet to continue')
      } else {
        toast.error('Failed to connect wallet')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setBalance('0')
    toast.success('Wallet disconnected')
  }

  const switchNetwork = async (chainId: string) => {
    if (typeof window.ethereum === 'undefined') return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        toast.error('Please add this network to your wallet')
      } else {
        toast.error('Failed to switch network')
      }
    }
  }

  const updateBalance = async () => {
    if (!provider || !account) return

    try {
      const balance = await provider.getBalance(account)
      setBalance(ethers.formatEther(balance))
    } catch (error) {
      console.error('Failed to update balance:', error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        account,
        balance,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
