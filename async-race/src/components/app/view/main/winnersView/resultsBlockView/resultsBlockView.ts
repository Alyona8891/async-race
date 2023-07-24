import './resultsBlock.css';
import View from '../../../view';
import { ParametersElementCreator } from '../../../../../../types/types';
import ElementCreator from '../../../../../units/elementCreator';
import WinnersTableHeaderView from '../winnersTableHeader/winnersTableHeaderView';
import OneTablelineView from './oneTableLineView/oneTableLineView';

export default class ResultsBlockView extends View {
    constructor(dataWinners: [], countCars: number, currentPage: number) {
        const parameters: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__results-block', 'results-block'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.configView(dataWinners, countCars, currentPage);
    }

    configView(dataWinners: [], countWinners: number, currentPage: number): void {
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
        const tableHeader = new WinnersTableHeaderView();
        this.elementCreator?.addInnerElement(tableHeader.getElementCreator());
        dataWinners.forEach((el: Record<string, string>, i: number) => {
            const oneGarage = new OneTablelineView(i + 1, '#FFFFFF', 'nnnnn', el.wins, el.time);
            this.elementCreator?.addInnerElement(oneGarage.getElementCreator());
        });
    }

    deleteContent(): void {
        const htmlElement = this.elementCreator?.getCreatedElement();
        while (htmlElement?.firstElementChild) {
            htmlElement.firstElementChild.remove();
        }
    }
}
