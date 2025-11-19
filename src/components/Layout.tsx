import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart3, History, Sparkles } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/history', icon: History, label: 'History' },
    { path: '/workout', icon: Activity, label: 'Workout' },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen text-foreground">
      {/* Header with gradient */}
      <header className="border-b border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-pulse opacity-30" />
        <div className="container mx-auto px-4 py-6 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-float">
              ▸
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">
              Calisthenics Arrow
            </span>
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </h1>
        </div>
      </header>

      {/* Navigation with glass effect */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-gradient-to-r from-card/90 via-card/70 to-card/90 backdrop-blur-2xl">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-4 transition-all duration-300 relative group ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse rounded-t-full" />
                  )}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
