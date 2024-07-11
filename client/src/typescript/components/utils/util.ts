import DOMUtils from "./domUtils";












export const togglePasswordVisibility = (
  eyeIcon: HTMLElement,
  eyeIconButton: HTMLElement,
  passwordField: HTMLInputElement
) => {
  if (passwordField.type === "password") {
    DOMUtils.addAttribute(passwordField,'type','text')
    DOMUtils.addAttribute(eyeIconButton, 'aria-label', 'hide password');
    DOMUtils.removeClass(eyeIcon,"fa-eye-slash")
    DOMUtils.addClass(eyeIcon, "fa-eye");
    eyeIcon.classList.add("fa-eye");
  } else {
    DOMUtils.addAttribute(eyeIconButton, 'aria-label', 'show password');
    DOMUtils.addAttribute(passwordField, 'type', 'password');
    DOMUtils.addClass(eyeIcon,"fa-eye-slash")
    DOMUtils.removeClass(eyeIcon, "fa-eye");
  }
};


export const displayResponseNotification = (message: string,isResponseOk:boolean): void => {
  const notificationCenter = document.querySelector("[data-notificationCenter]");
  const responseSuccessClass = "notification--success";
  const responseFailureClass = "notification--error"

  const createNotification = (textContent:string, className:string) => {
    const container = document.createElement("div");
    const paragraph = document.createElement("p");
    paragraph.textContent = textContent;
    container.appendChild(paragraph);
    container.classList.add(className);
    return container;
  };
  
  const notification = createNotification(message,isResponseOk ? responseSuccessClass : responseFailureClass);
  notificationCenter?.appendChild(notification);
  setTimeout(() => notificationCenter?.removeChild(notification), 3000);
}