import { Link, Outlet, useRouterState } from '@tanstack/react-router'

import { AppIcon, type AppIconName } from '@/components/icons/AppIcon'
import { cn } from '@/lib/utils'

type NavigationItem = {
  label: string
  description: string
  to: '/' | '/ingestion' | '/knowledge-base' | '/conversations' | '/settings'
  icon: AppIconName
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Overview',
    description: 'Monitor ingestion and retrieval activity.',
    to: '/',
    icon: 'overview',
  },
  {
    label: 'Ingestion',
    description: 'Manage document and website ingestion workflows.',
    to: '/ingestion',
    icon: 'ingestion',
  },
  {
    label: 'Knowledge Base',
    description: 'Review indexed sources and retrieval content.',
    to: '/knowledge-base',
    icon: 'knowledgeBase',
  },
  {
    label: 'Conversations',
    description: 'Inspect support conversations and answer quality.',
    to: '/conversations',
    icon: 'conversations',
  },
  {
    label: 'Settings',
    description: 'Configure workspace and application preferences.',
    to: '/settings',
    icon: 'settings',
  },
]

export function AppShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const currentNavigationItem =
    navigationItems.find((item) => item.to === pathname) ?? navigationItems[0]

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#043c3b] px-3 py-5 text-white md:flex">
        <div className="flex items-center gap-3 px-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#0f6a57]">
            <AppIcon name="bot" className="size-6" />
          </div>
          <p className="text-lg font-semibold tracking-tight">AI Support Admin</p>
        </div>

        <nav aria-label="Primary navigation" className="mt-10 flex flex-1 flex-col gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-emerald-50/90 transition-colors hover:bg-white/8 hover:text-white"
              activeProps={{
                className:
                  'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]',
              }}
            >
              <AppIcon name={item.icon} className="size-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <button
            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-emerald-50/90 transition-colors hover:bg-white/8 hover:text-white"
            type="button"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-5 items-center justify-center rounded-full border border-current text-xs">
                ?
              </span>
              Help
            </span>
            <AppIcon name="chevronRight" className="size-4" />
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentNavigationItem.label}
            </h1>
            <p className="text-sm text-slate-500">{currentNavigationItem.description}</p>
          </div>

          <div className="flex items-center gap-5">
            <button
              aria-label="Notifications"
              className="text-slate-700 transition-colors hover:text-slate-950"
              type="button"
            >
              <AppIcon name="bell" className="size-5" />
            </button>

            <button className="flex items-center gap-2 text-sm font-medium" type="button">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#043c3b] text-xs font-semibold text-white">
                A
              </span>
              <span>Admin</span>
              <AppIcon name="chevronDown" className="size-4 text-slate-500" />
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-1rem)] p-1 md:p-4">
          <section
            className={cn(
              'flex min-h-[calc(100vh-9rem)] items-center justify-center   border-slate-300 bg-white',
              'shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
            )}
          >
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}
