import { ParametersElementCreator } from '../../../types/types';
import ElementCreator from '../../units/elementCreator';

export default class View {
    elementCreator: ElementCreator | null;

    constructor(parameters: ParametersElementCreator) {
        this.elementCreator = View.createView(parameters);
    }

    getElementCreator(): Element | undefined {
        if (this.elementCreator) {
            return this.elementCreator.getCreatedElement();
        }
        return undefined;
    }

    static createView(parameters: ParametersElementCreator): ElementCreator | null {
        const elementCreator: ElementCreator = new ElementCreator(parameters);
        return elementCreator;
    }
}
