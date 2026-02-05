import { Card } from '@/components/ui/Card'
import { Wallet, Copy, ExternalLink, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface BalanceCardProps {
  address: string
  balances: {
    usdc: number
    usdt: number
  }
  onAddFunds: () => void
}

export function BalanceCard({ address, balances, onAddFunds }: BalanceCardProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-background-card via-background-card to-primary/5 border-white/5 relative overflow-hidden group">
      <div className="absolute -right-16 -top-16 h-64 w-64 bg-primary/10 rounded-full blur-3xl transition-all group-hover:bg-primary/20" />

      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest">
              Your Portfolio
            </h2>
            <div className="flex items-center gap-2 group/addr">
              <span className="text-xl font-mono text-white opacity-80">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-all opacity-0 group-hover/addr:opacity-100"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-text-muted">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider">USDC Balance</span>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">
              ${balances.usdc.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-text-muted">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider">USDT Balance</span>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">
              ${balances.usdt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onAddFunds}
            className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            Add Funds
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="h-14 w-14 rounded-2xl p-0 hover:scale-[1.02] transition-all"
          >
            <ExternalLink className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
