"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FolderKanban,
  Package,
  FileText,
  UserPlus,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AdminLogo } from "@/components/admin/admin-logo"
import type { AdminRole } from "@/lib/supabase/types"

const NAV: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  roles: AdminRole[]
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "admin", "sales", "viewer"] },
  { href: "/admin/leads", label: "Leads", icon: Users, roles: ["owner", "admin", "sales", "viewer"] },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, roles: ["owner", "admin", "sales", "viewer"] },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, roles: ["owner", "admin", "sales", "viewer"] },
  { href: "/admin/packages", label: "Packages", icon: Package, roles: ["owner", "admin"] },
  { href: "/admin/invoices", label: "Invoices", icon: FileText, roles: ["owner", "admin"] },
  { href: "/admin/team", label: "Team", icon: UserPlus, roles: ["owner", "admin"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["owner", "admin"] },
]

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-3">
        <AdminLogo size="sm" showAdminLabel />
      </div>
      {NAV.filter((item) => item.roles.includes(role)).map((item) => {
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-primary/5 hover:text-primary",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
