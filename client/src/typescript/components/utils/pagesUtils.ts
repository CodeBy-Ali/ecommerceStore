import DOMUtils from "./domUtils";
import { apiStatus } from "../../../config/config";
import { addProductToCart } from "../Cart/cart";

export interface IFormData{
  [field: string]: string | boolean | undefined;
}

export function handleApiResponse<T>(
  responseBody: any,
  implementation: (data: T) => void,
  requiredFields: (keyof T)[]
) {
  if (!responseBody || !(typeof responseBody === "object")) {
    return console.error("Missing or unknown Response body");
  }
  const { status, message, data } = responseBody;
  console.log(responseBody);
  if (status !== apiStatus.SUCCESS) {
    console.info(`Api request failed. Message: `, message);
    message && showNotification(message, false);
    return;
  }
  const missingFields = requiredFields.filter((field) => !(field in data));
  if (missingFields.length > 1) {
    return console.log(
      `Following fields are missing from required Fields: ${missingFields.join(
        ", "
      )}`
    );
  }

  implementation(data);
}

export const togglePasswordVisibility = (
  eyeIcon: HTMLElement,
  eyeIconButton: HTMLElement,
  passwordField: HTMLInputElement
) => {
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
  const notificationCenter = document.querySelector(
    "[data-notification-center]"
  );
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
  const notificationType = success
    ? successNotificationClass
    : failureNotificationClass;
  const notification = createNotification(message, notificationType);
  notificationCenter?.appendChild(notification);
  setTimeout(() => notificationCenter?.removeChild(notification), 4000);
};

export const enterProcessingState = (element: HTMLElement) => {
  if (!element)
    return console.log("Valid HTMLElement required to add loading animation.");
  DOMUtils.addClass(element, "processing");
};

export const exitProcessingState = (element: HTMLElement) => {
  if (!element)
    return console.log(
      "Valid HTMLElement required to remove loading animation."
    );
  DOMUtils.removeClass(element, "processing");
};


export function handleAddToCartClick(e: Event) {
  const actionButton = e.target as HTMLButtonElement;
  const productId = actionButton.getAttribute("data-productId");
  const quantityInputFiled = document.querySelector<HTMLInputElement>(
    "input[data-product-quantity-input]"
  );
  if (!quantityInputFiled) return;
  if (!productId) {
    showNotification(
      "Failed to add product to cart. Please try again later..",
      false
    );
    throw new Error("Missing required argument: ProductId");
  }
  const quantity = Number(quantityInputFiled.value);
  addProductToCart(actionButton, productId, quantity);
}
// TODO replace the formData interface with more strict an type safe one
// TODO remove for loop and nested if conditions
export function extractFormData(form: HTMLFormElement) {
  const inputElements = Array.from(form.elements) as HTMLInputElement[];
  const data: IFormData = {};
  for (const element of inputElements) {
    const value = element.name.length > 0 ? getElementValue(element) : null;
    if (value !== null) {
      data[element.name] = value;
    }
  }

  function getElementValue(element: HTMLInputElement): string | boolean | null {
    let value;
    switch (element.type) {
      case "radio":
        value = element.checked ? element.value : null;
        break;
      case "checkbox":
        value = element.checked;
        break;
      default: 
        value = element.value.length > 0 ? element.value : null
    }
    return value;
  }

  return data;
}

export function logErrorWithNotification(
  errorMessage: string,
  notificationMessage: string = "Failed to process the request. Plz try again later.."
) {
  showNotification(notificationMessage, false);
  console.error(errorMessage);
}

export async function submitForm<T>(url: string, body: T) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseBody = await response.json();
      showNotification(responseBody?.message, false);
      return;
    }

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return logErrorWithNotification(error.message);
    }
    console.error(error);
  }
}
