
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  RefreshCw,
  Bell, 
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Upload,
  Banknote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "sidebar-item group",
        isActive && "active"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="transition-opacity duration-200">{label}</span>}
      {isCollapsed && (
        <div className="absolute left-16 z-50 p-2 px-3 rounded-md bg-popover shadow-md text-popover-foreground text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
          {label}
        </div>
      )}
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out",
          "flex flex-col",
          "bg-sidebar border-r border-sidebar-border",
          isCollapsed ? "w-20" : "w-70"
        )}
        style={{ width: isCollapsed ? '80px' : '280px' }}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold tracking-tight">
                Balance System
              </span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className={cn(
              "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
              isCollapsed && "hidden"
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className={cn(
              "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
              !isCollapsed && "hidden"
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className={cn("flex-1 py-6", isCollapsed && "px-3", !isCollapsed && "px-4")}>
          <div className={cn("flex flex-col gap-2")}>
            <SidebarLink 
              to="/" 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/balance-corrections" 
              icon={RefreshCw} 
              label="Balance Corrections" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/compensation-upload" 
              icon={Upload} 
              label="Upload Compensation" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/notifications" 
              icon={Bell} 
              label="Fx Rate Notifications" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/transfer-rates" 
              icon={Banknote} 
              label="Reference Rate" 
              isCollapsed={isCollapsed} 
            />
          </div>
        </nav>
        
        <div className={cn("p-4 border-t border-sidebar-border", isCollapsed && "px-3")}>
          <SidebarLink 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            isCollapsed={isCollapsed} 
          />
        </div>
      </aside>
    </>
  );
}
