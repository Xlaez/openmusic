import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Info, AlertCircle, Wallet, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PricingData {
  pricePerUnit: number
  totalUnits: number
}

interface PricingFormProps {
  data: PricingData
  onChange: (data: Partial<PricingData>) => void
}

export function PricingForm({ data, onChange }: PricingFormProps) {
  const { user } = useAuthStore()

  const backingPercentage = 0.5 // 50%
  const backingValuePerUnit = data.pricePerUnit * backingPercentage
  const artistEarningsPerSale = data.pricePerUnit - backingValuePerUnit
  const platformUnits = 2
  const initialBackingDeposit = backingValuePerUnit * platformUnits // Cost to back the initial reserved units

  const hasBalance = (user?.balance.usdc || 0) >= initialBackingDeposit

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Pricing & Supply</h2>
        <p className="text-text-secondary">Set the value and scarcity of your release.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-sm font-medium text-text-secondary">
                Price per Edition (USDC)
              </label>
              <span className="text-xs text-text-muted">Min: $1 • Max: $1000</span>
            </div>
            <input
              type="number"
              min="1"
              max="1000"
              value={data.pricePerUnit}
              onChange={(e) => onChange({ pricePerUnit: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-sm font-medium text-text-secondary">
                Total Supply (Units)
              </label>
              <span className="text-xs text-text-muted">Min: 1 • Max: 10,000</span>
            </div>
            <input
              type="number"
              min="1"
              max="10000"
              value={data.totalUnits}
              onChange={(e) => onChange({ totalUnits: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
            />
          </div>

          <Card className="p-4 bg-primary/5 border-primary/10 space-y-3">
            <div className="flex items-center gap-2 font-bold text-primary text-sm">
              <TrendingUp className="h-4 w-4" />
              Revenue Breakdown
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Artist Share (100% of Premium)</span>
                <span className="text-white font-medium">
                  ${artistEarningsPerSale.toFixed(2)} per sale
                </span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Project Backing (Stored Value)</span>
                <span className="text-white font-medium">
                  ${backingValuePerUnit.toFixed(2)} per sale
                </span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Platform Fee</span>
                <span className="text-green-400 font-medium">$0.00</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between font-bold text-white">
                <span>Total Sale Price</span>
                <span className="text-primary">${data.pricePerUnit.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Deployment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  Initial Backing Deposit
                  <Info className="h-3 w-3" />
                </span>
                <span className="text-white font-medium">
                  ${initialBackingDeposit.toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  Reserved Units (Kept by Artist)
                  <Info className="h-3 w-3" />
                </span>
                <span className="text-white font-medium">{platformUnits} units</span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span>Available to Fans</span>
                <span className="text-green-400 font-bold">
                  {Math.max(0, data.totalUnits - platformUnits)} units
                </span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'p-4 rounded-xl border flex flex-col gap-4',
              hasBalance ? 'bg-black/20 border-white/10' : 'bg-red-500/5 border-red-500/20',
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  hasBalance ? 'bg-white/5 text-text-muted' : 'bg-red-500/10 text-red-500',
                )}
              >
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">
                  Your Balance
                </p>
                <p
                  className={cn(
                    'text-lg font-mono font-bold',
                    hasBalance ? 'text-white' : 'text-red-400',
                  )}
                >
                  {user?.balance.usdc.toLocaleString()} USDC
                </p>
              </div>
            </div>

            {!hasBalance && (
              <div className="flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>
                  Insufficient balance to cover the initial backing deposit. Please add USDC to your
                  wallet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
