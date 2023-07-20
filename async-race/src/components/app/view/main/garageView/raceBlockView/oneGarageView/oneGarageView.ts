import './oneGarage.css';
import { ParametersElementCreator } from '../../../../../../../types/types';
import ElementCreator from '../../../../../../units/elementCreator';
import View from '../../../../view';
import carElementString from '../../../../../../../data/data';

export default class OneGarageView extends View {
    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['race-block__garage', 'block-garage'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.configView();
    }

    configView(): void {
        const parametersSelectButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['block-garage__button'],
            textContent: 'Select',
            callback: null,
        };
        const selectButton = new ElementCreator(parametersSelectButton);
        this.elementCreator?.addInnerElement(selectButton);
        const parametersDeleteButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['block-garage__button'],
            textContent: 'Delete',
            callback: null,
        };
        const deleteButton = new ElementCreator(parametersDeleteButton);
        this.elementCreator?.addInnerElement(deleteButton);
        const parametersNameModeleElement: ParametersElementCreator = {
            tag: 'span',
            tagClasses: ['block-garage__name'],
            textContent: 'Opel',
            callback: null,
        };
        const nameModeleElement = new ElementCreator(parametersNameModeleElement);
        this.elementCreator?.addInnerElement(nameModeleElement);
        const parametersRoadContainer: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['block-garage__road-container'],
            textContent: '',
            callback: null,
        };
        const roadContainer = new ElementCreator(parametersRoadContainer);
        this.elementCreator?.addInnerElement(roadContainer);
        const parametersStartButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['block-garage__button_moving'],
            textContent: 'A',
            callback: null,
        };
        const startButton = new ElementCreator(parametersStartButton);
        roadContainer.addInnerElement(startButton);
        const parametersStopButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['block-garage__button_moving'],
            textContent: 'B',
            callback: null,
        };
        const stopButton = new ElementCreator(parametersStopButton);
        roadContainer.addInnerElement(stopButton);
        roadContainer.getCreatedElement()?.insertAdjacentHTML('beforeend', carElementString);
        const parametersFlagElement: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['block-garage__flag'],
            textContent: '',
            callback: null,
        };
        const flagElement = new ElementCreator(parametersFlagElement);
        roadContainer.addInnerElement(flagElement);
    }
}