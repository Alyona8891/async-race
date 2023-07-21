import { baseUrl, path } from '../../../../../data/data';
import { ParametersElementCreator, ParametersInputCreator } from '../../../../../types/types';
import ElementCreator from '../../../../units/elementCreator';
import InputCreator from '../../../../units/inputCreator/inputCreator';
import View from '../../view';
import './garage.css';
import RaceBlockView from './raceBlockView/raceBlockView';

export default class GarageView extends View {
    creatingField: string;

    updatingField: string;

    creatingFieldColor: string;

    updatingFieldColor: string;

    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'section',
            tagClasses: ['page-main__garage-block', 'garage-block'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.creatingField = '';
        this.creatingFieldColor = '#000000';
        this.updatingField = '';
        this.updatingFieldColor = '#000000';
        this.configView();
    }

    async configView() {
        let inputCreator;
        let inputParameters: ParametersInputCreator = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-block'],
            textContent: '',
            callback: {
                keyup: (event) => this.handler(event, 'creatingField'),
                change: (event) => this.handler(event, 'creatingField'),
                click: (event) => {
                    const targetElement = event.target;
                    if (targetElement instanceof HTMLButtonElement) {
                        alert(`${this.creatingField} ${this.creatingFieldColor}`);
                    }
                },
            },
            buttonName: 'create',
        };
        inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
        inputParameters = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-block'],
            textContent: '',
            callback: {
                keyup: (event) => this.handler(event, 'updatingField'),
                change: (event) => this.handler(event, 'updatingField'),
                click: (event) => {
                    const targetElement = event.target;
                    if (targetElement instanceof HTMLButtonElement) {
                        alert('ku');
                    }
                },
            },
            buttonName: 'update',
        };
        inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
        const parametersRaceButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'RACE',
            callback: null,
        };
        const raceButton = new ElementCreator(parametersRaceButton);
        this.elementCreator?.addInnerElement(raceButton.getCreatedElement());
        const parametersResetButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'RESET',
            callback: null,
        };
        const resetButton = new ElementCreator(parametersResetButton);
        this.elementCreator?.addInnerElement(resetButton.getCreatedElement());
        const parametersGenerateCarsButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'GENERATE CARS',
            callback: null,
        };
        const generateCarsButton = new ElementCreator(parametersGenerateCarsButton);
        this.elementCreator?.addInnerElement(generateCarsButton.getCreatedElement());
        const parametersRaceBlock = await GarageView.getCars();
        const data = await parametersRaceBlock.data;
        const countCars = await parametersRaceBlock.countCars;
        let raceBlock;
        if (countCars) {
            raceBlock = new RaceBlockView(data, countCars);
        }
        this.elementCreator?.addInnerElement(await raceBlock.getElementCreator());
    }

    handler(event: Event, inputField: string) {
        if (event.target instanceof HTMLInputElement && !event.target.hasAttribute('type')) {
            this[inputField] = event.target.value;
        }
        if (event.target instanceof HTMLInputElement && event.target.hasAttribute('type')) {
            this[`${inputField}Color`] = event.target.value;
        }
        if (event.target instanceof HTMLButtonElement) {
            this[`${inputField}Color`] = event.target.value;
        }
    }

    static async getCars() {
        const response = await fetch(`${baseUrl}${path.garage}?_page=1&_limit=7`);
        const data = await response.json();
        const countCars = await response.headers.get('X-Total-Count');
        return { data, countCars };
    }
}
