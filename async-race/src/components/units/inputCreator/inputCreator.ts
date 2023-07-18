import { ParametersElementCreator } from '../../../types/types';
import ElementCreator from '../elementCreator';

export default class InputCreator extends ElementCreator {
    inputElement!: HTMLInputElement;

    inputColorElement!: HTMLInputElement;

    createElement(parameters: ParametersElementCreator): void {
        this.element = document.createElement('div');
        this.setClasses(parameters.tagClasses);
        this.setTextContent(parameters.textContent);
        if (parameters.callback) {
            this.setCallBack(parameters.callback);
        }
        this.inputElement = document.createElement('input');
        this.element.append(this.inputElement);
        this.inputColorElement = document.createElement('input');
        this.inputColorElement.setAttribute('type', 'color');
        this.element.append(this.inputColorElement);
    }
}
