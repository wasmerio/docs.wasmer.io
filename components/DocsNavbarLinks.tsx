'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'nextra/components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'

const sections = [
  { href: '/runtime', label: 'Runtime' },
  { href: '/registry', label: 'Registry' },
  { href: '/edge', label: 'Edge' },
  { href: '/sdk/wasmer-js', label: 'SDKs' },
]

function XLogoIcon() {
  return (
    <svg
      viewBox="0 0 1200 1227"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M714.163 519.284 1160.89 0h-105.8L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.821l409.633-476.146 327.218 476.146H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894L144.011 79.694h162.604l304.839 436.204 47.468 67.894 396.218 566.448H892.534L569.165 687.828Z" />
    </svg>
  )
}

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
      <div className="ml-auto flex items-center gap-1">
        <Search
          className="hidden lg:block lg:w-56 xl:w-64"
          placeholder="Search docs..."
        />
        <Link
          href="https://x.com/wasmerio"
          target="_blank"
          rel="noreferrer"
          aria-label="Wasmer on X"
          className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <XLogoIcon />
        </Link>
        <Link
          href="https://discord.gg/qBTfsNP7N8"
          target="_blank"
          rel="noreferrer"
          aria-label="Wasmer on Discord"
          className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <DiscordIcon className="h-5 w-5" />
        </Link>
        <Link
          href="https://github.com/wasmerio"
          target="_blank"
          rel="noreferrer"
          aria-label="Wasmer on GitHub"
          className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <GitHubIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
