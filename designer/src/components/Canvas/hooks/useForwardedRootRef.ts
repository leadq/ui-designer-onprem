import { type ForwardedRef, useCallback, useLayoutEffect, useRef } from 'react'

const assignRef = (ref: ForwardedRef<HTMLElement>, element: HTMLElement | null): void => {
  if (typeof ref === 'function') {
    ref(element)
  } else if (ref) {
    ref.current = element
  }
}

/** Keep the adapter callback stable while React consumers may replace their ref. */
export const useForwardedRootRef = (ref: ForwardedRef<HTMLElement>) => {
  const elementRef = useRef<HTMLElement | null>(null)
  const committedRef = useRef<ForwardedRef<HTMLElement>>(null)

  const setRootRef = useCallback((element: HTMLElement | null) => {
    elementRef.current = element

    assignRef(committedRef.current, element)
  }, [])

  useLayoutEffect(() => {
    committedRef.current = ref

    assignRef(ref, elementRef.current)

    return () => {
      committedRef.current = null

      assignRef(ref, null)
    }
  }, [ref])

  return setRootRef
}
