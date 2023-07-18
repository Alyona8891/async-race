import { ParametersElementCreator } from '../../../../../types/types';
import InputCreator from '../../../../units/inputCreator/inputCreator';
import View from '../../view';
import './garage.css';

export default class GarageView extends View {
    creatingField: string;

    updatingField: string;

    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'section',
            tagClasses: ['page-main__garage-block', 'garage-block'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.creatingField = '';
        this.updatingField = '';
        this.configView();
    }

    configView() {
        let inputParameters: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-block'],
            textContent: '',
            callback: {
                keyup: (event) => this.keyupHandler(event, 'creatingField'),
            },
        };
        let inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
        inputParameters = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-block'],
            textContent: '',
            callback: {
                keyup: (event) => this.keyupHandler(event, 'updatingField'),
            },
        };
        inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
    }

    keyupHandler(event: Event, inputField: string) {
        if (event.target instanceof HTMLInputElement) {
            this[inputField] = event.target.value;
        }
    }
}
