import { useState, useEffect } from "react"

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    // Clear timeout.
    return () => clearTimeout(timer)
  }, [value, delay])

  return { debouncedValue, setDebouncedValue }
}

export default useDebounce
