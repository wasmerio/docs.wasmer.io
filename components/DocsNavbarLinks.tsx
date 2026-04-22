'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sections = [
  { href: '/runtime', label: 'Runtime' },
  { href: '/registry', label: 'Registry' },
  { href: '/edge', label: 'Edge' },
  { href: '/sdk/wasmer-js', label: 'SDKs' },
]

export default function DocsNavbarLinks() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-1 md:items-center">
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1">
        {sections.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
      <Link
        href="https://twitter.com/wasmerio"
        target="_blank"
        rel="noreferrer"
        className="ml-auto rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
      >
        Contact ↗
      </Link>
    </div>
  )
}
