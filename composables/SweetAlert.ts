import Swal, { type SweetAlertIcon } from "sweetalert2";

export default class SweetAlert {
  protected static display(message: string, icon: SweetAlertIcon, confirm = false) {
    return Swal.fire({
      text: message,
      icon: icon,
      showConfirmButton: confirm,
    })
  }

  public static success(message: string) {
    return this.display(message, "success")
  }

  public static error(message: string) {
    return this.display(message, "error")
  }

  public static confirm(message: string) {
    return this.display(message, "question", true)
  }
}