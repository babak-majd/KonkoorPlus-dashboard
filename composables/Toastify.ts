import { toast, type ToastOptions } from "vue3-toastify";

export default class Toastify {
  protected static display(message: string, option = {} as ToastOptions) {
    toast(message, {
      autoClose: 3000,
      position: 'bottom-right',
      transition: 'flip',
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
    this.display(message, { type: 'success' })
  }
}