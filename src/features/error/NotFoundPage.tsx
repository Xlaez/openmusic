import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Disc, Home, Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl scale-150 rounded-full" />
        <Disc className="h-32 w-32 text-primary/50 relative z-10 animate-spin-slow opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl font-black text-white/10 tracking-tighter">404</span>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Oops! Page not found.</h1>
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          The track you're looking for seems to have been deleted or never existed.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <Link to="/">
          <Button
            variant="primary"
            size="lg"
            className="h-14 px-8 rounded-2xl font-bold gap-2 shadow-xl shadow-primary/20"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
        <Link to="/explore" search={{ filter: 'all', q: '' }}>
          <Button
            variant="secondary"
            size="lg"
            className="h-14 px-8 rounded-2xl font-bold gap-2 bg-white/5 border-white/10"
          >
            <Search className="h-5 w-5" />
            Explore Music
          </Button>
        </Link>
      </div>
    </div>
  )
}
