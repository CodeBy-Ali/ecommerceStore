class Util{
  
  static addClass(element, className) {
    element.classList.add(className)
  }

  static removeClass(element, className) {
    element.classList.remove(className)
  }

  static hasClass(element, className) {
    return element.classList.contains(className)
  }

  static toggleClass(element, className) {
    element.classList.toggle(className)
  }

  static addAttribute(element, attributeName, attributeValue) {
    element.setAttribute(attributeName, attributeValue);
  }

  static toggleAttributeBoolean(element,attributeName) {
    const isCurrentAttributeTrue = element.getAttribute(attributeName) === "true";
    element.setAttribute(attributeName,isCurrentAttributeTrue ? "false" : "true");
  }
}

export default Util;