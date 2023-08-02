import './resultsBlock.css';
import View from '../../../view';
import { Car, ParametersElementCreator, ParametersResultBlock } from '../../../../../../types/types';
import WinnersTableHeaderView from '../winnersTableHeader/winnersTableHeaderView';
import TableLineView from './tableLineView/tableLineView';
import { baseUrl, path } from '../../../../../../data/data';

export default class ResultsBlockView extends View {
  constructor(
    dataWinners: ParametersResultBlock[],
    countCars: number,
    currentPage: number,
    winsSort: string,
    timeSort: string,
  ) {
    const parameters: ParametersElementCreator = {
      tag: 'div',
      tagClasses: ['garage-block__results-block', 'results-block'],
      textContent: '',
      callback: null,
    };
    super(parameters);
    this.configView(dataWinners, countCars, currentPage, winsSort, timeSort);
  }

  configView(
    dataWinners: ParametersResultBlock[],
    countWinners: number,
    currentPage: number,
    winsSort: string,
    timeSort: string,
  ): void {
    this.addCreatedElement('h2', ['results-block__title'], `Winners(${countWinners})`, this.elementCreator);
    this.addCreatedElement('h3', ['results-block__subtitle'], `Page #${currentPage}`, this.elementCreator);
    const tableHeader = new WinnersTableHeaderView(winsSort, timeSort);
    this.elementCreator?.addInnerElement(tableHeader.getElementCreator());
    let numberLine = 0;
    dataWinners.forEach(async (el) => {
      numberLine += 1;
      const oneGarage = new TableLineView(
        numberLine,
        el.colorWinner,
        el.nameWinner,
        el.winsWinner,
        el.timeWinner,
      );
      const oneGarageElement = oneGarage.getElementCreator();
      this.elementCreator?.addInnerElement(oneGarageElement);
    });
  }

  deleteContent(): void {
    const htmlElement = this.elementCreator?.getCreatedElement();
    while (htmlElement?.firstElementChild) {
      htmlElement.firstElementChild.remove();
    }
  }

  static async getCar(id: number): Promise<Car> {
    let data;
    try {
      const response = await fetch(`${baseUrl}${path.garage}/${id}`);
      data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return data;
  }
}
