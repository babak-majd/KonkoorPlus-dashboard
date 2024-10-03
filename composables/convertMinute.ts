export const useConvertMinute = (minute: any) => {
  let holder = minute % 60
  let hour = (minute - holder) / 60

  if (hour === 0) {
    return `${holder} دقیقه`
  }
  if (holder === 0) {
    return `${hour} ساعت`
  }
  return `${hour} ساعت و ${holder} دقیقه`
}
