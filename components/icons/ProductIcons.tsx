import type { ComponentProps } from 'react'

type IconProps = ComponentProps<'svg'>

export function RunIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M21 6H7"
        stroke="#02C372"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 16H13"
        stroke="#02C372"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 26H6"
        stroke="#02C372"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PublishIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M16 6C13.7807 6 11.6245 6.73824 9.87093 8.09845C8.11736 9.45866 6.86608 11.3635 6.31417 13.5131"
        stroke="#FA9E33"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33975 21C8.44938 22.9219 10.1668 24.4202 12.2216 25.2587C14.2764 26.0972 16.5517 26.2284 18.6892 25.6316"
        stroke="#FA9E33"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.6603 21C25.7699 19.0781 26.2087 16.8416 25.9075 14.6428C25.6063 12.4441 24.5822 10.408 22.9966 8.85527"
        stroke="#FA9E33"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DeployIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M13.25 10L14.625 7.5L16 5L17.375 7.5L18.75 10L20.125 12.5"
        stroke="#AC5CE0"
        strokeWidth="3.17405"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.25 20L25.625 22.5L27 25H24.25H21.5H18.75"
        stroke="#AC5CE0"
        strokeWidth="3.17405"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 25H7.75H5L6.375 22.5L7.75 20L9.125 17.5"
        stroke="#AC5CE0"
        strokeWidth="3.17405"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
