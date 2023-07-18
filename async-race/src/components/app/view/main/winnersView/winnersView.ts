import './winners.css';
import { ParametersElementCreator } from '../../../../../types/types';
import View from '../../view';

export default class WinnersView extends View {
    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'section',
            tagClasses: ['page-main__winners-block', 'winners-block'],
            textContent: '',
            callback: null,
        };
        super(parameters);
    }
}
