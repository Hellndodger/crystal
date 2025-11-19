import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart3, History } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/history', icon: History, label: 'History' },
    { path: '/workout', icon: Activity, label: 'Workout' },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary">▸</span> Calisthenics Arrow
          </h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-3 transition-colors relative ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
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
