import { ParametersElementCreator } from '../../../types/types';
import ElementCreator from '../../units/elementCreator';

export default class View {
  elementCreator: ElementCreator | null;

  constructor(parameters: ParametersElementCreator) {
    this.elementCreator = View.createView(parameters);
  }

  getElementCreator(): Element | undefined {
    if (this.elementCreator) {
      return this.elementCreator.getCreatedElement();
    }
    return undefined;
  }

  static createView(parameters: ParametersElementCreator): ElementCreator | null {
    const elementCreator: ElementCreator = new ElementCreator(parameters);
    return elementCreator;
  }

  checkStatusActive(
    buttonPrev: ElementCreator,
    buttonNext: ElementCreator,
    maxPage,
    currentPage,
  ): void {
    const buttonPrevElement = buttonPrev.getCreatedElement() as HTMLButtonElement;
    const buttonNextElement = buttonNext.getCreatedElement() as HTMLButtonElement;
    if (maxPage === 1) {
      console.log(3);
      buttonPrevElement.disabled = true;
      buttonNextElement.disabled = true;
    } else if (maxPage > 1 && currentPage === 1) {
      console.log(2);
      buttonPrevElement.disabled = true;
      buttonNextElement.disabled = false;
    } else if (maxPage > 1 && currentPage === maxPage) {
      console.log(4);
      buttonPrevElement.disabled = false;
      buttonNextElement.disabled = true;
    } else if (maxPage > 1 && currentPage !== maxPage && currentPage !== 1) {
      console.log(5);
      buttonPrevElement.disabled = false;
      buttonNextElement.disabled = false;
    }
  }
}
