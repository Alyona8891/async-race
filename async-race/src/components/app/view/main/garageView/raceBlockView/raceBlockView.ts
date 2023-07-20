import { ParametersElementCreator } from '../../../../../../types/types';
import ElementCreator from '../../../../../units/elementCreator';
import View from '../../../view';
import OneGarageView from './oneGarageView/oneGarageView';

export default class RaceBlockView extends View {
    arrElements: HTMLElement[];

    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__race-block', 'race-block'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.arrElements = [];
        this.configView();
    }

    configView(): void {
        const parametersRaceBlockTitle: ParametersElementCreator = {
            tag: 'h2',
            tagClasses: ['race-block__title'],
            textContent: 'Grage(1)',
            callback: null,
        };
        const raceBlockTitle = new ElementCreator(parametersRaceBlockTitle);
        this.elementCreator?.addInnerElement(raceBlockTitle);
        const parametersRaceBlockSubtitle: ParametersElementCreator = {
            tag: 'h3',
            tagClasses: ['race-block__subtitle'],
            textContent: 'Page #1',
            callback: null,
        };
        const raceBlockSubtitle = new ElementCreator(parametersRaceBlockSubtitle);
        this.elementCreator?.addInnerElement(raceBlockSubtitle);
        const oneGarage = new OneGarageView();
        this.elementCreator?.addInnerElement(oneGarage.getElementCreator());
    }

    rewrite(): void {
        const htmlElement = this.elementCreator?.getCreatedElement();
        while (htmlElement?.firstElementChild) {
            htmlElement.firstElementChild.remove();
        }
        this.arrElements = [];
        this.configView();
    }
}
