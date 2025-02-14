export default class Tools {
  public static DateTimeFormat(time: any, locale = "fa-IR-u-nu-latn", option: { year: "numeric", month: "2-digit", day: "2-digit" }) {
    if (typeof time === "string") {
      time = new Date(time)
    }
    return Intl.DateTimeFormat(locale, option).format(time)
  }
}
