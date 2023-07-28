import './raceBlock.css';
import { DataOneCar, ParametersElementCreator } from '../../../../../../types/types';
import View from '../../../view';
import OneGarageView from './oneGarageView/oneGarageView';

export default class RaceBlockView extends View {
  arrElements: HTMLElement[];

  constructor(dataCars: DataOneCar[], countCars: number, currentPage: number) {
    const parameters: ParametersElementCreator = {
      tag: 'div',
      tagClasses: ['garage-block__race-block', 'race-block'],
      textContent: '',
      callback: null,
    };
    super(parameters);
    this.arrElements = [];
    this.configView(dataCars, countCars, currentPage);
  }

  configView(dataCars: DataOneCar[], countCars: number, currentPage: number): void {
    this.addCreatedElement('h2', ['race-block__title'], `Garage(${countCars})`, this.elementCreator);
    this.addCreatedElement('h3', ['race-block__subtitle'], `Page #${currentPage}`, this.elementCreator);
    dataCars.forEach((dataCar) => {
      const oneGarage = new OneGarageView(dataCar);
      this.elementCreator?.addInnerElement(oneGarage.getElementCreator());
    });
  }

  deleteContent(): void {
    try {
      const htmlElement = this.elementCreator?.getCreatedElement();
      while (htmlElement?.firstElementChild) {
        htmlElement.firstElementChild.remove();
      }
      this.arrElements = [];
    } catch (error) {
      console.log(error);
    }
  }
}
