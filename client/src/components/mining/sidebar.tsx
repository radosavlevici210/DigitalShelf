import { Pickaxe, Activity, Server, Cpu, Wallet, BarChart3, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Activity, label: "Dashboard", href: "/" },
  { icon: Server, label: "Mining Pools", href: "/pools" },
  { icon: Cpu, label: "Hardware", href: "/hardware" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Pickaxe className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-card-foreground">CryptoMiner Pro</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-secondary-foreground hover:bg-secondary"
              )}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-card-foreground">Mining User</p>
            <p className="text-xs text-muted-foreground">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
