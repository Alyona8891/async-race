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
    this.addCreatedElement('button', ['block-garage__select-button'], 'Select', this.elementCreator);
    this.addCreatedElement('button', ['block-garage__delete-button'], 'Delete', this.elementCreator);
    this.addCreatedElement('span', ['block-garage__name'], dataCar.name, this.elementCreator);
    const roadContainer = this.addCreatedElement('div', ['block-garage__road-container'], '', this.elementCreator);
    const createdRoadContainer = roadContainer?.getCreatedElement();
    if (createdRoadContainer) {
      createdRoadContainer.id = dataCar.id.toString();
    }
    this.addCreatedElement('button', ['block-garage__button_moving'], 'A', roadContainer);
    const stopButton = this.addCreatedElement('button', ['block-garage__button_stopping'], 'B', roadContainer);
    stopButton.getCreatedElement()?.setAttribute('disabled', 'true');
    roadContainer
      .getCreatedElement()
      ?.insertAdjacentHTML('beforeend', changeFillSize(carElementString, dataCar.color, 60));
    this.addCreatedElement('div', ['block-garage__flag'], '', roadContainer);
  }
}
