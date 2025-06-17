import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Mining Dashboard</h2>
          <p className="text-muted-foreground">Real-time monitoring and performance analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-accent rounded-lg">
            <div className="w-2 h-2 bg-white rounded-full status-online"></div>
            <span className="text-sm font-medium text-accent-foreground">Mining Active</span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary-foreground">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
