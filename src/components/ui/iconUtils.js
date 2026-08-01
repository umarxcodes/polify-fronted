import { createElement, isValidElement } from 'react'

const isReactComponentType = (value) => {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' &&
      value !== null &&
      typeof value.render === 'function')
  )
}

export function resolveIcon(icon, size = 16, props = {}) {
  if (!icon) return null
  if (isValidElement(icon)) return icon
  if (isReactComponentType(icon)) {
    return createElement(icon, { size, ...props })
  }

  return null
}

export default resolveIcon
