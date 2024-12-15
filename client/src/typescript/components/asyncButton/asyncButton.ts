import DOMUtils from "../utils/domUtils";
import { showNotification } from "../utils/pagesUtils";

class AsyncButton {
  public constructor(private readonly button: HTMLButtonElement) {}

  public async withProcessingState<T extends unknown[]>(
    fn: (...args: T) => unknown,
    args: T,
  ) {
    try {
      this.enterProcessingState();
      await fn(...args);
    } catch (error) {
      showNotification("Failed to process your request", false);
      console.error(error);
    } finally {
      this.exitProcessingState();
    }
  }

  private enterProcessingState() {
    DOMUtils.addClass(this.button, "processing");
  }

  private exitProcessingState() {
    DOMUtils.removeClass(this.button, "processing");
  }
}

export default AsyncButton;