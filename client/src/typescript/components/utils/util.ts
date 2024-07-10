export const togglePasswordVisibility = (eyeIcon: HTMLElement, passwordField: HTMLInputElement) => {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  } else {
    passwordField.type = "password";
    eyeIcon.classList.add("fa-eye-slash");
    eyeIcon.classList.remove("fa-eye");
  }
};
