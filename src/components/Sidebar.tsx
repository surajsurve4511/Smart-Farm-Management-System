'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, MapPinned, CalendarPlus, Bot,
  TrendingUp, BarChart3, Sprout, Landmark, PawPrint, Package,
  Video, Settings, LogOut, Hexagon, Sun, Moon, TestTube2, Network
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const NAV_GROUPS = [
  {
    label: 'Core Modules',
    color: 'emerald',
    items: [
      { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
      { href: '/dashboard/farms', label: 'My Farms', icon: MapPinned },
      { href: '/dashboard/daily-log', label: 'Daily Log', icon: CalendarPlus },
      { href: '/dashboard/ai-chat', label: 'Farm CEO (AI)', icon: Bot },
    ],
  },
  {
    label: 'Intelligence',
    color: 'cyan',
    items: [
      { href: '/dashboard/market', label: 'Market Prices', icon: TrendingUp },
      { href: '/dashboard/yield', label: 'Yield Prediction', icon: BarChart3 },
      { href: '/dashboard/crop-guidance', label: 'Crop Guidance', icon: Sprout },
      { href: '/dashboard/schemes', label: 'Govt Schemes', icon: Landmark },
    ],
  },
  {
    label: 'Assets',
    color: 'amber',
    items: [
      { href: '/dashboard/livestock', label: 'Livestock', icon: PawPrint },
      { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
    ],
  },
  {
    label: 'Agriculture 4.0 (Lab)',
    color: 'purple',
    items: [
      { href: '/dashboard/digital-twin', label: 'Digital Twin Engine', icon: Hexagon },
      { href: '/dashboard/nano-management', label: 'Nano-Management', icon: TestTube2 },
      { href: '/dashboard/ai-video', label: 'Video Diagnosis', icon: Video },
    ],
  },
  {
    label: 'System',
    color: 'slate',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const COLOR_MAP: Record<string, string> = {
  emerald: 'text-emerald-500/70',
  cyan: 'text-cyan-500/70',
  amber: 'text-amber-500/70',
  purple: 'text-purple-500/70',
  slate: 'text-slate-500/70',
}

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 w-72 h-full bg-white/[0.02] backdrop-blur-2xl border-r border-white/[0.06] z-40 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Hexagon className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight">Farm OS</span>
          <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">Intelligence Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 mb-2 ${COLOR_MAP[group.color]}`}>
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                      active
                        ? 'bg-white/[0.05] text-white border border-white/[0.1] shadow-[0_0_20px_rgba(52,211,153,0.08)]'
                        : 'text-slate-400 border border-transparent hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-emerald-400' : ''}`} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all border border-transparent"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <div className="relative w-[18px] h-[18px]">
            <Sun className={`w-[18px] h-[18px] absolute inset-0 transition-all duration-300 ${
              theme === 'light' ? 'opacity-100 rotate-0 scale-100 text-amber-500' : 'opacity-0 rotate-90 scale-75'
            }`} />
            <Moon className={`w-[18px] h-[18px] absolute inset-0 transition-all duration-300 ${
              theme === 'dark' ? 'opacity-100 rotate-0 scale-100 text-cyan-400' : 'opacity-0 -rotate-90 scale-75'
            }`} />
          </div>
          <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`ml-auto w-10 h-[22px] rounded-full relative transition-colors duration-300 ${
            theme === 'dark' ? 'bg-emerald-500/20' : 'bg-black/[0.08]'
          }`}>
            <div className={`w-4 h-4 rounded-full absolute top-[3px] transition-all duration-300 shadow-sm ${
              theme === 'dark'
                ? 'left-[21px] bg-emerald-400'
                : 'left-[3px] bg-white border border-black/10'
            }`} />
          </div>
        </button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{userEmail}</p>
            <p className="text-[10px] text-emerald-500/70 font-semibold uppercase tracking-widest">Root Admin</p>
          </div>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="p-2 rounded-xl hover:bg-white/[0.05] text-slate-500 hover:text-red-400 transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
