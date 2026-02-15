import { useClipboard } from "./useClipboard"

export function useRoom() {
  const { copy } = useClipboard()


  return { copy }
}

