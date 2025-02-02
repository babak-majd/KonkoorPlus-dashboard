import { toast, type ToastOptions } from "vue3-toastify";

export default class Toastify {
  protected static display(message: string, option = {} as ToastOptions) {
    toast(message, {
      autoClose: 3000,
      position: 'top-right',
      transition: 'flip',
      ...option
    })

  }
  public static success(message: string) {
    this.display(message, { type: 'success' })
  }
}