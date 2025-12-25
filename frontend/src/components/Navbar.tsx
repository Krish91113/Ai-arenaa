import { NavLink } from '@/components/NavLink';
import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="font-mono text-lg font-semibold tracking-tight">
            Multi-Agent Arena
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className="rounded-md px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeClassName="bg-accent text-foreground"
          >
            Playground
          </NavLink>
          <NavLink
            to="/history"
            className="rounded-md px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeClassName="bg-accent text-foreground"
          >
            History
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
