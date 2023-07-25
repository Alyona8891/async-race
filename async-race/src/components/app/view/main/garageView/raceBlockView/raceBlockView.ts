import './raceBlock.css';
import { DataOneCar, ParametersElementCreator } from '../../../../../../types/types';
import ElementCreator from '../../../../../units/elementCreator';
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
        const parametersRaceBlockTitle: ParametersElementCreator = {
            tag: 'h2',
            tagClasses: ['race-block__title'],
            textContent: `Garage(${countCars})`,
            callback: null,
        };
        const raceBlockTitle = new ElementCreator(parametersRaceBlockTitle);
        this.elementCreator?.addInnerElement(raceBlockTitle);
        const parametersRaceBlockSubtitle: ParametersElementCreator = {
            tag: 'h3',
            tagClasses: ['race-block__subtitle'],
            textContent: `Page #${currentPage}`,
            callback: null,
        };
        const raceBlockSubtitle = new ElementCreator(parametersRaceBlockSubtitle);
        this.elementCreator?.addInnerElement(raceBlockSubtitle);
        dataCars.forEach((dataCar) => {
            const oneGarage = new OneGarageView(dataCar);
            this.elementCreator?.addInnerElement(oneGarage.getElementCreator());
        });
    }

    deleteContent(): void {
        const htmlElement = this.elementCreator?.getCreatedElement();
        while (htmlElement?.firstElementChild) {
            htmlElement.firstElementChild.remove();
        }
        this.arrElements = [];
    }
}
