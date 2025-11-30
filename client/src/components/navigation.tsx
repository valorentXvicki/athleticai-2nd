import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { MessageSquare, LayoutDashboard, LogOut, Menu, X, Zap, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user
    ? [
        { href: "/chat", label: "AI Coach", icon: MessageSquare },
        { href: "/recommendations", label: "Recommendations", icon: Sparkles },
        { href: "/events", label: "Events", icon: Calendar },
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ]
    : [];

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-primary/20 bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? "/chat" : "/"} className="flex items-center gap-2 group">
            <div className="w-3 h-3 rounded-full bg-primary glow-primary animate-pulse-glow" />
            <span className="font-heading text-xl tracking-wide uppercase font-bold text-foreground group-hover:text-primary transition-colors">
              Athletic Spirit
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={`gap-2 ${isActive(link.href) ? "bg-primary/10 text-primary" : ""}`}
                  data-testid={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                  <div className="w-2 h-2 rounded-full bg-status-online" />
                  <span className="text-sm text-muted-foreground">
                    {user.displayName || user.username}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="gap-2 gradient-primary" data-testid="button-signup">
                    <Zap className="w-4 h-4" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive(link.href) ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="border-t border-border pt-4 mt-2">
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-button-login"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        className="w-full gradient-primary"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-button-signup"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}