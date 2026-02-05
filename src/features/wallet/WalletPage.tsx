import { useState } from 'react'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { TransactionHistory } from '@/components/wallet/TransactionHistory'
import { AddFundsModal } from '@/components/wallet/AddFundsModal'
import { useAuthStore } from '@/store/auth'

export function WalletPage() {
  const { user, addBalance } = useAuthStore()
  const [showAddFunds, setShowAddFunds] = useState(false)

  if (!user) return null

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Wallet</h1>
        <p className="text-text-secondary text-lg">Manage your funds and track your earnings.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <BalanceCard
            address={user.walletAddress}
            balances={user.balance}
            onAddFunds={() => setShowAddFunds(true)}
          />
        </div>

        <div className="lg:col-span-7">
          <TransactionHistory />
        </div>
      </div>

      {showAddFunds && (
        <AddFundsModal
          onClose={() => setShowAddFunds(false)}
          onAdd={(amount, currency) => addBalance(amount, currency)}
        />
      )}
    </div>
  )
}
