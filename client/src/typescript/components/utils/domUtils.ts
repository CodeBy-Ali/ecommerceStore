class Util{
  
  static addClass(element:HTMLElement | null, className:string) {
    element?.classList.add(className)
  }

  static removeClass(element:HTMLElement | null, className:string) {
    element?.classList.remove(className)
  }

  static hasClass(element:HTMLElement | null, className:string) {
    return element?.classList.contains(className)
  }

  static toggleClass(element:HTMLElement | null, className:string) {
    element?.classList.toggle(className)
  }

  static addAttribute(element:HTMLElement, attributeName:string, attributeValue:string) {
    element?.setAttribute(attributeName, attributeValue);
  }

  static toggleAttributeBoolean(element:HTMLElement | null,attributeName:string) {
    const isCurrentAttributeTrue = element?.getAttribute(attributeName) === "true";
    element?.setAttribute(attributeName,isCurrentAttributeTrue ? "false" : "true");
  }
}

export default Util;