import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { X, CreditCard, Wallet as WalletIcon, Check, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AddFundsModalProps {
  onClose: () => void
  onAdd: (amount: number, currency: 'usdc' | 'usdt') => void
}

export function AddFundsModal({ onClose, onAdd }: AddFundsModalProps) {
  const [amount, setAmount] = useState<string>('100')
  const [currency, setCurrency] = useState<'usdc' | 'usdt'>('usdc')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAddFunds = async () => {
    setIsProcessing(true)
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 2000))
    onAdd(Number(amount), currency)
    setIsProcessing(false)
    setIsSuccess(true)
    setTimeout(() => onClose(), 2000)
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <Card className="max-w-md w-full p-8 border-white/5 bg-background-card overflow-hidden relative">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <Check className="h-10 w-10 text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Funds Added!</h2>
              <p className="text-text-secondary">
                Your wallet has been credited with ${amount} {currency.toUpperCase()}.
              </p>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-[progress_2s_linear]" />
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="max-w-md w-full p-8 border-white/5 bg-background-card space-y-8 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 h-40 w-40 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10" />

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Add Funds</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-3">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">
              Amount to Add
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xl">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-24 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/10"
                placeholder="100"
              />
              <div className="absolute right-2 top-2 bottom-2 bg-white/5 border border-white/10 rounded-xl flex">
                <button
                  onClick={() => setCurrency('usdc')}
                  className={cn(
                    'px-4 text-xs font-bold transition-all rounded-lg',
                    currency === 'usdc'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-muted hover:text-white',
                  )}
                >
                  USDC
                </button>
                <button
                  onClick={() => setCurrency('usdt')}
                  className={cn(
                    'px-4 text-xs font-bold transition-all rounded-lg',
                    currency === 'usdt'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'text-text-muted hover:text-white',
                  )}
                >
                  USDT
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled
                className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl opacity-50 cursor-not-allowed"
              >
                <CreditCard className="h-6 w-6 text-text-muted" />
                <span className="text-xs font-bold text-text-muted">Debit Card</span>
                <span className="text-[10px] text-text-muted/50 font-mono">SOON</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl opacity-50 cursor-not-allowed"
              >
                <WalletIcon className="h-6 w-6 text-text-muted" />
                <span className="text-xs font-bold text-text-muted">Crypto</span>
                <span className="text-[10px] text-text-muted/50 font-mono">SOON</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="text-xs text-text-muted text-center leading-relaxed">
              For the MVP, you can add <span className="text-primary font-bold">Test Funds</span>{' '}
              instantly to interact with the platform.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={isProcessing || !amount}
          onClick={handleAddFunds}
          className="w-full h-14 rounded-2xl text-lg font-bold gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Processing...
            </>
          ) : (
            <>Add Test Funds</>
          )}
        </Button>
      </Card>
    </div>
  )
}
