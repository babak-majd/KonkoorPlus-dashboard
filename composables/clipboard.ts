export const useCopy = (text: string) => {
  navigator.clipboard.writeText(text)
}
