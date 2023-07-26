import './oneGarage.css';
import { DataOneCar, ParametersElementCreator } from '../../../../../../../types/types';
import ElementCreator from '../../../../../../units/elementCreator';
import View from '../../../../view';
import { carElementString } from '../../../../../../../data/data';
import changeFillSize from '../../../../../../functions/changeFill';

export default class OneGarageView extends View {
  constructor(dataCar: DataOneCar) {
    const parameters: ParametersElementCreator = {
      tag: 'div',
      tagClasses: ['race-block__garage', 'block-garage'],
      textContent: '',
      callback: null,
    };
    super(parameters);
    this.configView(dataCar);
  }

  configView(dataCar: DataOneCar): void {
    this.createElement('button', ['block-garage__select-button'], 'Select', this.elementCreator);
    this.createElement('button', ['block-garage__delete-button'], 'Delete', this.elementCreator);
    this.createElement('span', ['block-garage__name'], dataCar.name, this.elementCreator);
    const roadContainer = this.createElement('div', ['block-garage__road-container'], '', this.elementCreator);
    const createdRoadContainer = roadContainer?.getCreatedElement();
    if (createdRoadContainer) {
      createdRoadContainer.id = dataCar.id.toString();
    }
    this.createElement('button', ['block-garage__button_moving'], 'A', roadContainer);
    const stopButton = this.createElement('button', ['block-garage__button_stopping'], 'B', roadContainer);
    stopButton.getCreatedElement()?.setAttribute('disabled', 'true');
    roadContainer
      .getCreatedElement()
      ?.insertAdjacentHTML('beforeend', changeFillSize(carElementString, dataCar.color, 60));
    this.createElement('div', ['block-garage__flag'], '', roadContainer);
  }

  createElement(
    tagName: string,
    classNameArr: string[],
    text: string,
    element: ElementCreator | null,
  ): ElementCreator {
    const parametersElement: ParametersElementCreator = {
      tag: tagName,
      tagClasses: classNameArr,
      textContent: text,
      callback: null,
    };
    const createdElement = new ElementCreator(parametersElement);
    element?.addInnerElement(createdElement);
    return createdElement;
  }
}
