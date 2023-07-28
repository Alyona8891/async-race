import {
  CallbackObject, FunctionObject, ParametersElementCreator, ParametersInputCreator,
} from '../../types/types';

export default class ElementCreator {
  element: Element | null;

  innerHTML: string | undefined;

  inputElement: HTMLInputElement | null;

  inputColorElement: HTMLInputElement | null;

  buttonElement: HTMLButtonElement | null;

  constructor(parameters: ParametersElementCreator) {
    this.element = null;
    this.inputElement = null;
    this.inputColorElement = null;
    this.buttonElement = null;
    this.createElement(parameters);
  }

  createElement(parameters: ParametersElementCreator | ParametersInputCreator): void {
    this.element = document.createElement(parameters.tag);
    this.setClasses(parameters.tagClasses);
    this.setTextContent(parameters.textContent);
    if (parameters.callback) {
      this.setCallBack(parameters.callback);
    }
  }

  getCreatedElement(): Element | HTMLElement | undefined {
    if (this.element) {
      return this.element;
    }
    return undefined;
  }

  addInnerElement(element: Element | ElementCreator | undefined): void {
    if (element instanceof ElementCreator) {
      const createdElement = element.getCreatedElement();
      if (createdElement) {
        this.element?.append(createdElement);
      }
    } else if (element) {
      this.element?.append(element);
    }
  }

  setClasses(parameters: string[] | null): void {
    if (parameters) {
      parameters.forEach((className) => this.element?.classList.add(className));
    }
  }

  setTextContent(parameter: string): void {
    if (this.element) {
      this.element.textContent = parameter;
    }
  }

  setCallBack(callbackObject: CallbackObject | FunctionObject): void {
    if (this.element) {
      Object.entries(callbackObject).forEach(([key, value]) => {
        this.element?.addEventListener(key, value);
      });
    }
  }
}
