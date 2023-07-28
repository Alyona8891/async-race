import './resultsBlock.css';
import View from '../../../view';
import { DataOneCar, ParametersElementCreator, ParametersResultBlock } from '../../../../../../types/types';
import ElementCreator from '../../../../../units/elementCreator';
import WinnersTableHeaderView from '../winnersTableHeader/winnersTableHeaderView';
import OneTablelineView from './oneTableLineView/oneTableLineView';
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
    const parametersResultBlockTitle: ParametersElementCreator = {
      tag: 'h2',
      tagClasses: ['results-block__title'],
      textContent: `Winners(${countWinners})`,
      callback: null,
    };
    const resultsBlockTitle = new ElementCreator(parametersResultBlockTitle);
    this.elementCreator?.addInnerElement(resultsBlockTitle);
    const parametersResultsBlockSubtitle: ParametersElementCreator = {
      tag: 'h3',
      tagClasses: ['results-block__subtitle'],
      textContent: `Page #${currentPage}`,
      callback: null,
    };
    const resultBlockSubtitle = new ElementCreator(parametersResultsBlockSubtitle);
    this.elementCreator?.addInnerElement(resultBlockSubtitle);
    const tableHeader = new WinnersTableHeaderView(winsSort, timeSort);
    this.elementCreator?.addInnerElement(tableHeader.getElementCreator());
    let numberLine = 0;
    dataWinners.forEach(async (el) => {
      numberLine += 1;
      const oneGarage = new OneTablelineView(
        numberLine,
        el.colorWinner,
        el.nameWinner,
        el.winsWinner,
        el.timeWinner,
      );
      this.elementCreator?.addInnerElement(oneGarage.getElementCreator());
    });
  }

  deleteContent(): void {
    const htmlElement = this.elementCreator?.getCreatedElement();
    while (htmlElement?.firstElementChild) {
      htmlElement.firstElementChild.remove();
    }
  }

  static async getOneCar(id: number): Promise<DataOneCar> {
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
