class Util{
  
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
}

export default Util;