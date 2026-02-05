import { useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { X, Wallet, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Project } from '@/types'
import { useAuthStore } from '@/store/auth'
import { usePurchaseProject } from '@/lib/api/project'
import { cn } from '@/lib/utils/cn'

interface PurchaseModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function PurchaseModal({ project, isOpen, onClose }: PurchaseModalProps) {
  const { user } = useAuthStore()
  const { mutate: purchase, isPending, isSuccess, isError, error, reset } = usePurchaseProject()
  const modalRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !user) return null

  const NETWORK_FEE = 10
  const totalCost = project.price + NETWORK_FEE
  const hasFunds = user.balance.usdc >= totalCost

  const handlePurchase = () => {
    purchase({ project, currency: 'usdc' })
  }

  const handleClose = () => {
    if (isSuccess) {
      // Maybe navigate?
    }
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <Card
        ref={modalRef}
        className="relative w-full max-w-md bg-background-card border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 p-0 overflow-hidden"
      >
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Purchase Successful!</h2>
              <p className="text-text-muted mt-2">
                "{project.title}" has been added to your library.
              </p>
            </div>
            <Button variant="primary" className="w-full" onClick={handleClose}>
              Start Listening
            </Button>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Confirm Purchase</h2>
              <button
                onClick={handleClose}
                disabled={isPending}
                className="text-text-muted hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <img src={project.coverImage} className="h-20 w-20 rounded-md object-cover" />
                <div>
                  <h3 className="font-bold text-white">{project.title}</h3>
                  <p className="text-sm text-text-muted">{project.artist.displayName}</p>
                </div>
              </div>

              <div className="space-y-3 bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Project Price</span>
                  <span className="text-white font-medium">{project.price} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Network Fee (Est.)</span>
                  <span className="text-white font-medium">{NETWORK_FEE} USDC</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-primary">{totalCost} USDC</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-white/10 bg-black/20">
                <Wallet className="h-5 w-5 text-text-muted" />
                <div className="flex-1">
                  <p className="text-text-secondary">Your Balance</p>
                  <p className={cn('font-medium', hasFunds ? 'text-white' : 'text-red-400')}>
                    {user.balance.usdc} USDC
                  </p>
                </div>
              </div>

              {isError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error?.message || 'Transaction failed'}</span>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full py-6 text-lg font-bold"
                onClick={handlePurchase}
                disabled={isPending || !hasFunds}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : hasFunds ? (
                  'Confirm Purchase'
                ) : (
                  'Insufficient Funds'
                )}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
