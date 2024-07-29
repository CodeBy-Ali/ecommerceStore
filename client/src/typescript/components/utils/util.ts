import DOMUtils from "./domUtils";

export const togglePasswordVisibility = (eyeIcon: HTMLElement, eyeIconButton: HTMLElement, passwordField: HTMLInputElement) => {
  if (passwordField.type === "password") {
    DOMUtils.addAttribute(passwordField, "type", "text");
    DOMUtils.addAttribute(eyeIconButton, "aria-label", "hide password");
    DOMUtils.removeClass(eyeIcon, "fa-eye-slash");
    DOMUtils.addClass(eyeIcon, "fa-eye");
    eyeIcon.classList.add("fa-eye");
  } else {
    DOMUtils.addAttribute(eyeIconButton, "aria-label", "show password");
    DOMUtils.addAttribute(passwordField, "type", "password");
    DOMUtils.addClass(eyeIcon, "fa-eye-slash");
    DOMUtils.removeClass(eyeIcon, "fa-eye");
  }
};

export const showNotification = (message: string, success: boolean): void => {
  const notificationCenter = document.querySelector("[data-notificationCenter]");
  const successNotificationClass = "notification--success";
  const failureNotificationClass = "notification--error";

  const createNotification = (textContent: string, className: string) => {
    const container = document.createElement("div");
    const paragraph = document.createElement("p");
    paragraph.textContent = textContent;
    container.appendChild(paragraph);
    container.classList.add(className);
    return container;
  };

  const notificationType = success ? successNotificationClass : failureNotificationClass;
  const notification = createNotification(message, notificationType);
  notificationCenter?.appendChild(notification);
  setTimeout(() => notificationCenter?.removeChild(notification), 4000);
};

export const enterProcessingState = (element: HTMLElement) => {
  if (!element) return console.log("Valid HTMLElement required to add loading animation.");
  DOMUtils.addClass(element, "processing");
};

export const exitProcessingState = (element: HTMLElement) => {
  if (!element) return console.log("Valid HTMLElement required to remove loading animation.");
  DOMUtils.removeClass(element, "processing");
};
