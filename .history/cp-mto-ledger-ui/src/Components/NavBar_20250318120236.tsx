import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils.ts";
import { 
  Home, 
  BarChart3, 
  DollarSign, 
  AlertTriangle, 
  Package, 
  FileText, 
  Bell, 
  PieChart,
  Menu,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, href, isActive, onClick }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary" />
          <span className="text-lg font-semibold">MTO Ledger</span>
        </div>
      </header>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar header */}
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary" />
            <span className="text-lg font-semibold">MTO Ledger</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 md:hidden" 
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Sidebar content */}
        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-1">
            <NavItem 
              icon={<Home className="h-4 w-4" />} 
              label="Home" 
              href="/" 
              isActive={isActive("/")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<BarChart3 className="h-4 w-4" />} 
              label="MTO Balance" 
              href="/balance" 
              isActive={isActive("/balance")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<DollarSign className="h-4 w-4" />} 
              label="Compensations" 
              href="/compensations" 
              isActive={isActive("/compensations")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<AlertTriangle className="h-4 w-4" />} 
              label="Risk Value" 
              href="/risk-value" 
              isActive={isActive("/risk-value")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<Package className="h-4 w-4" />} 
              label="Product Management" 
              href="/products" 
              isActive={isActive("/products")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<FileText className="h-4 w-4" />} 
              label="Reference Rate" 
              href="/reference-rate" 
              isActive={isActive("/reference-rate")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<Bell className="h-4 w-4" />} 
              label="Fx Rate Notifications" 
              href="/notifications" 
              isActive={isActive("/notifications")}
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<PieChart className="h-4 w-4" />} 
              label="Reports" 
              href="/reports" 
              isActive={isActive("/reports")}
              onClick={() => setIsOpen(false)}
            />
          </div>
        </nav>

        {/* User profile */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
