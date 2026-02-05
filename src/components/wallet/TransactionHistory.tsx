import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, ShoppingBag, Music, History } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Transaction {
  id: string
  type: 'purchase' | 'creation' | 'deposit' | 'withdrawal'
  amount: number
  currency: 'usdc' | 'usdt'
  date: string
  status: 'success' | 'pending' | 'failed'
  title?: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    amount: -20.0,
    currency: 'usdc',
    date: '2 hours ago',
    status: 'success',
    title: 'Midnight Protocol - EP',
  },
  {
    id: '2',
    type: 'creation',
    amount: -10.0,
    currency: 'usdc',
    date: '1 day ago',
    status: 'success',
    title: 'Neon Nights',
  },
  {
    id: '3',
    type: 'deposit',
    amount: 100.0,
    currency: 'usdc',
    date: '3 days ago',
    status: 'success',
  },
  {
    id: '4',
    type: 'purchase',
    amount: -15.5,
    currency: 'usdc',
    date: '1 week ago',
    status: 'success',
    title: 'Crystal Peaks - Single',
  },
]

export function TransactionHistory() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="h-5 w-5" />
      case 'creation':
        return <Music className="h-5 w-5" />
      case 'deposit':
        return <TrendingUp className="h-5 w-5" />
      case 'withdrawal':
        return <TrendingDown className="h-5 w-5" />
      default:
        return <History className="h-5 w-5" />
    }
  }

  const getLabel = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'Music Purchase'
      case 'creation':
        return 'Project Creation'
      case 'deposit':
        return 'Wallet Deposit'
      case 'withdrawal':
        return 'Wallet Withdrawal'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <History className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-white">Transaction History</h2>
      </div>

      <Card className="p-0 border-white/5 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Type & Description
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-xl flex items-center justify-center border border-white/5',
                          tx.amount > 0
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-primary/10 text-primary',
                        )}
                      >
                        {getIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{getLabel(tx.type)}</p>
                        {tx.title && (
                          <p className="text-xs text-text-muted truncate max-w-[200px]">
                            {tx.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p
                      className={cn(
                        'font-mono font-bold text-lg',
                        tx.amount > 0 ? 'text-green-400' : 'text-white',
                      )}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount.toFixed(2)} {tx.currency.toUpperCase()}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-text-muted">{tx.date}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                        tx.status === 'success'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : tx.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20',
                      )}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
