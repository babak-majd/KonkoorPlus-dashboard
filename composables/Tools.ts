export default class Tools {
  public static DateTimeFormat(time: any, locale = "fa-IR-u-nu-latn", option: { year: "numeric", month: "2-digit", day: "2-digit" }) {
    if (typeof time === "string") {
      time = new Date(time)
    }
    return Intl.DateTimeFormat(locale, option).format(time)
  }

  public static showDuration(duration: number) {
    let hours = Math.floor(duration / 60)
    let mins = duration - (hours * 60)
    let duration_text = ''
    let result = []
    if (hours > 0) {
      result.push(`${hours} ساعت`)
    }
    if (mins > 0) {
      result.push(`${mins} دقیقه`)
    }

    return result.length === 2 ? result.join(' و ') : result.join('')
  }
}
