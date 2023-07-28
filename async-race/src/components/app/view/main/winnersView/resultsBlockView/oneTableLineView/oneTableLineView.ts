import './oneTableLine.css';
import { ParametersElementCreator } from '../../../../../../../types/types';
import ElementCreator from '../../../../../../units/elementCreator';
import View from '../../../../view';
import { carElementString } from '../../../../../../../data/data';
import changeFillSize from '../../../../../../functions/changeFill';

export default class OneTableLineView extends View {
  constructor(number: number, color: string, nameCar: string, winsCount: number, time: number) {
    const parameters: ParametersElementCreator = {
      tag: 'div',
      tagClasses: ['winners-block__container'],
      textContent: '',
      callback: null,
    };
    super(parameters);
    this.configView(number, color, nameCar, winsCount, time);
  }

  configView(
    number: number,
    color: string,
    nameCar: string,
    winsCount: number,
    time: number,
  ): void {
    this.addCreatedElement('div', ['winners-block__table-line', 'number'], number.toString(), this.elementCreator);
    const parametersTableLineCar: ParametersElementCreator = {
      tag: 'div',
      tagClasses: ['winners-block__table-line', 'car'],
      textContent: '',
      callback: null,
    };
    const tableLinerCar = new ElementCreator(parametersTableLineCar);
    tableLinerCar.getCreatedElement()?.insertAdjacentHTML('beforeend', changeFillSize(carElementString, color, 30));
    this.elementCreator?.addInnerElement(tableLinerCar.getCreatedElement());
    this.addCreatedElement('div', ['winners-block__table-line', 'name'], nameCar, this.elementCreator);
    this.addCreatedElement('div', ['winners-block__table-line', 'wins', 'wins-sort'], winsCount.toString(), this.elementCreator);
    this.addCreatedElement('div', ['winners-block__table-line', 'time', 'time-sort'], time.toString(), this.elementCreator);
  }
}
