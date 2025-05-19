import { Dialog, DialogUtility } from "@syncfusion/ej2-react-popups";

export function showAlertDialog({
  title,
  content,
}: {
  title: string;
  content: string | HTMLElement;
}) {
  // const highestZIndex =
  //   Array.from(document.querySelectorAll("*"))
  //     .map((el) => parseFloat(window.getComputedStyle(el).zIndex))
  //     .filter((zIndex) => !isNaN(zIndex))
  //     .sort((a, b) => b - a)[0] || 0;

  DialogUtility.alert({
    animationSettings: { effect: "Zoom" },
    closeOnEscape: true,
    content,
    okButton: {
      text: "OK",
      click() {
        (this as Dialog).hide();
      },
    },
    position: { X: "center", Y: "center" },
    showCloseIcon: false,
    title,
    //zIndex: highestZIndex + 1,
  });
}

export async function showConfirmDialog({
  cancelTextButton,
  content,
  okTextButton,
  showCloseIcon = false,
  title,
}: {
  cancelTextButton: string;
  content: string | HTMLElement;
  okTextButton: string;
  showCloseIcon?: boolean;
  title: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    DialogUtility.confirm({
      animationSettings: { effect: "Zoom" },
      closeOnEscape: false,
      content,
      isModal: true,
      position: { X: "center", Y: "center" },
      showCloseIcon,
      title,
      //height: "200px",
      okButton: {
        text: okTextButton,
        click() {
          (this as Dialog).hide();
          resolve(true);
        },
      },
      cancelButton: {
        text: cancelTextButton,
        click() {
          (this as Dialog).hide();
          resolve(false);
        },
      },
    });
  });
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
