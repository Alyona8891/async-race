import { ParametersInputCreator } from '../../../types/types';
import ElementCreator from '../elementCreator';

export default class InputCreator extends ElementCreator {
    inputElement!: HTMLInputElement;

    inputColorElement!: HTMLInputElement;

    buttonElement!: HTMLButtonElement;

    createElement(parameters: ParametersInputCreator): void {
        this.element = document.createElement('div');
        this.setClasses(parameters.tagClasses);
        if (parameters.callback) {
            this.setCallBack(parameters.callback);
        }
        this.inputElement = document.createElement('input');
        this.element.append(this.inputElement);
        this.inputColorElement = document.createElement('input');
        this.inputColorElement.setAttribute('type', 'color');
        this.element.append(this.inputColorElement);
        this.buttonElement = document.createElement('button');
        this.buttonElement.classList.add('input-block__button');
        if (parameters.buttonName) {
            this.buttonElement.innerText = parameters.buttonName.toUpperCase();
        }
        this.element.append(this.buttonElement);
    }
}
