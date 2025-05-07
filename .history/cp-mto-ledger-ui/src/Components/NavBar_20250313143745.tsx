import React, { useState } from "react";
import HomePage from "./HomePage.tsx";
import { Button } from "../components/ui/button.tsx";
import Link from "next/link"
import { cn } from "../lib/utils.ts";


interface NavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
  onClick?: () => void
}

function NavItem({ icon, label, href, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

const NavBar : React.FC = ()=>{
  const [isOpen, setIsOpen] = useState(false)

  // Current path would normally come from usePathname() in Next.js
  const currentPath = "/dashboard"

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary" />
          <span className="text-lg font-semibold">Admin</span>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex flex-1">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform md:static md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Sidebar header */}
          <div className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary" />
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </div>
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 md:hidden" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Sidebar content */}
          <nav className="flex-1 overflow-auto p-4">
            <div className="space-y-1">
              <NavItem icon={<HomePage className="h-4 w-4" />} label="Home" href="/" onClick={closeSidebar} />
              <NavItem
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Dashboard"
                href="/dashboard"
                isActive={currentPath === "/dashboard"}
                onClick={closeSidebar}
              />
              <NavItem
                icon={<FileText className="h-4 w-4" />}
                label="Documents"
                href="/documents"
                onClick={closeSidebar}
              />
              <NavItem
                icon={<BarChart className="h-4 w-4" />}
                label="Analytics"
                href="/analytics"
                onClick={closeSidebar}
              />
              <NavItem icon={<Users className="h-4 w-4" />} label="Team" href="/team" onClick={closeSidebar} />
              <NavItem
                icon={<MessageSquare className="h-4 w-4" />}
                label="Messages"
                href="/messages"
                onClick={closeSidebar}
              />
            </div>

            <div className="mt-8 space-y-1">
              <h3 className="px-3 text-xs font-medium text-muted-foreground">Settings</h3>
              <NavItem
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                href="/settings"
                onClick={closeSidebar}
              />
            </div>
          </nav>

          {/* User profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-6xl space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="h-32 rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NavBar;