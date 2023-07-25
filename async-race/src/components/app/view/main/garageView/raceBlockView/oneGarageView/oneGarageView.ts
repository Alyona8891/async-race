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
        const parametersSelectButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['block-garage__select-button'],
            textContent: 'Select',
            callback: null,
        };
        const selectButton = new ElementCreator(parametersSelectButton);
        this.elementCreator?.addInnerElement(selectButton);
        const parametersDeleteButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['block-garage__delete-button'],
            textContent: 'Delete',
            callback: null,
        };
        const deleteButton = new ElementCreator(parametersDeleteButton);
        this.elementCreator?.addInnerElement(deleteButton);
        const parametersNameModeleElement: ParametersElementCreator = {
            tag: 'span',
            tagClasses: ['block-garage__name'],
            textContent: dataCar.name,
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
        const createdRoadContainer = roadContainer?.getCreatedElement();
        if (createdRoadContainer) {
            createdRoadContainer.id = dataCar.id.toString();
        }
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
            tagClasses: ['block-garage__button_stopping'],
            textContent: 'B',
            callback: null,
        };
        const stopButton = new ElementCreator(parametersStopButton);
        roadContainer.addInnerElement(stopButton);
        stopButton.getCreatedElement()?.setAttribute('disabled', 'true');
        roadContainer
            .getCreatedElement()
            ?.insertAdjacentHTML('beforeend', changeFillSize(carElementString, dataCar.color, 60));
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
