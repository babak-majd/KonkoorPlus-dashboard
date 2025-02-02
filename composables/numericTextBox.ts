export const useNumericKeydown = (event: KeyboardEvent) => {
  if (/^[0-9]$/i.test(event.key) || event.key === "Backspace" || event.key === "Tab") {
    return true
  }
  event.preventDefault()
}
