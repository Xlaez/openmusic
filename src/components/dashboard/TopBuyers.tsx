import type { Buyer } from '@/lib/api/dashboard'
import { Card } from '@/components/ui/Card'

export function TopBuyers({ buyers }: { buyers: Buyer[] }) {
  return (
    <Card className="flex flex-col h-full bg-background-card border-white/5">
      <div className="p-6 border-b border-white/5">
        <h3 className="font-bold text-white">Top Collectors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-muted font-medium border-b border-white/5 bg-white/[0.02]">
            <tr>
              <th className="p-4 pl-6">Rank</th>
              <th className="p-4">Collector</th>
              <th className="p-4 text-right">Spent</th>
              <th className="p-4 text-right">Purchases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {buyers.map((buyer, i) => (
              <tr key={buyer.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 text-text-muted">#{i + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={buyer.avatar} className="h-8 w-8 rounded-full bg-white/10" />
                    <span className="font-medium text-white">{buyer.username}</span>
                  </div>
                </td>
                <td className="p-4 text-right font-medium text-green-400">${buyer.totalSpent}</td>
                <td className="p-4 text-right text-text-secondary">{buyer.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
