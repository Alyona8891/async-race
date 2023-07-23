import './winners.css';
import { ParametersElementCreator } from '../../../../../types/types';
import View from '../../view';
import ElementCreator from '../../../../units/elementCreator';
import { baseUrl, path } from '../../../../../data/data';
import ResultsBlockView from './resultsBlockView/resultsBlockView';

export default class WinnersView extends View {
    maxPage: number;

    currentPage: number;

    resultsBlock!: ResultsBlockView;

    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'section',
            tagClasses: ['page-main__winners-block', 'winners-block'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.currentPage = 1;
        this.maxPage = 1;
        this.configView();
    }

    configView(/* dataCars: [], countCars: number, currentPage: number */): void {
        const parametersButtonPrev: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__pagination-prev'],
            textContent: 'Prev Page',
            callback: {
                click: () => {
                    if (this.currentPage !== 1) {
                        this.currentPage -= 1;
                        this.resultsBlock.deleteContent();
                        this.createResultsView(this.currentPage);
                    }
                },
            },
        };
        const buttonPrev = new ElementCreator(parametersButtonPrev);
        this.elementCreator?.addInnerElement(buttonPrev.getCreatedElement());
        const parametersButtonNext: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__pagination-next'],
            textContent: 'Next Page',
            callback: {
                click: () => {
                    if (this.currentPage !== this.maxPage) {
                        this.currentPage += 1;
                        this.resultsBlock.deleteContent();
                        this.createResultsView(this.currentPage);
                    }
                },
            },
        };
        const buttonNext = new ElementCreator(parametersButtonNext);
        this.elementCreator?.addInnerElement(buttonNext.getCreatedElement());
        this.createResultsView(this.currentPage);
    }

    static async getWinners(currentPage) {
        const response = await fetch(`${baseUrl}${path.winners}?_page=${currentPage}&_limit=10`);
        const data = await response.json();
        const countCars = Number(await response.headers.get('X-Total-Count'));
        const maxPage = Math.ceil(countCars / 10);
        return { data, countCars, maxPage };
    }

    async createResultsView(currentPage) {
        const parametersRaceBlock = await WinnersView.getWinners(this.currentPage);
        const data = await parametersRaceBlock.data;
        const countCars = await parametersRaceBlock.countCars;
        const maxPage = await parametersRaceBlock.maxPage;
        let resultsBlock;
        if (countCars) {
            resultsBlock = new ResultsBlockView(data, countCars, currentPage);
            this.resultsBlock = resultsBlock;
            this.maxPage = maxPage;
        }
        this.elementCreator?.addInnerElement(await resultsBlock.getElementCreator());
    }
}
