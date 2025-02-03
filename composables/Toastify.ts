import { toast, type ToastOptions, type ToastType } from "vue3-toastify";

export default class Toastify {
  protected static display(message: string, type: ToastType, option = {} as ToastOptions) {
    toast(message, {
      autoClose: 3000,
      position: 'bottom-right',
      transition: 'flip',
      type: type,
      dangerouslyHTMLString: true,
      style: {
        fontFamily: 'iranyekan',
        fontSize: '14px',  // پیش‌فرض فونت
        fontWeight: '600',
        padding: '10px',
        borderRadius: '8px',
        left: '0',
        right: '0',
        '@media (max-width: 600px)': {
          fontSize: '16px',
          padding: '12px',
          borderRadius: '6px',
          right: '14px'
        },
      },
      ...option
    })

  }
  public static success(message: string) {
    this.display(message, "success")
  }

  public static error(message: string) {
    this.display(message, "error")
  }

  public static showByStatus(message: string, is_success: boolean) {
    is_success ? this.success(message) : this.error(message)
  }
}