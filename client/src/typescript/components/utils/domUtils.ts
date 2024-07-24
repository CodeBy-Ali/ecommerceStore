class DOMUtils{
  
  static addClass(element:HTMLElement | null, className:string):void {
    element?.classList.add(className)
  }

  static removeClass(element:HTMLElement | null, className:string):void {
    element?.classList.remove(className)
  }

  static hasClass(element:HTMLElement | null, className:string):boolean | undefined {
    return element?.classList.contains(className)
  }

  static toggleClass(element:HTMLElement | null, className:string):void {
    element?.classList.toggle(className)
  }

  static checkAttributeValue(element: HTMLElement | null,attributeName: string, attributeValue: number | string):boolean {
    return element?.getAttribute(attributeName) === attributeValue;
  }

  static addAttribute(element:HTMLElement, attributeName:string, attributeValue:string):void {
    element?.setAttribute(attributeName, attributeValue);
  }

  static toggleAttributeBoolean(element:HTMLElement | null,attributeName:string):void {
    const isCurrentAttributeTrue = element?.getAttribute(attributeName) === "true";
    element?.setAttribute(attributeName,isCurrentAttributeTrue ? "false" : "true");
  }

  static addTextContent(element: HTMLElement | null, textContent: string | number): void{
    if (element) element.textContent = String(textContent);
    else console.log('Need a valid HTMLElement to add textContent');
  }

  static getElement<Type>(selector:string): Type|null{
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`Element with selector '${selector}' not found`);
      return null;
    }
    return element as Type;
  }
}

export default DOMUtils;