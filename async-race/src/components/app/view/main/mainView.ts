import './main.css';
import { ParametersElementCreator } from '../../../../types/types';
import View from '../view';

export default class MainView extends View {
    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'main',
            tagClasses: ['page__page-main', 'page-main'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        // this.configView();
    }

    /* configView(): void {
    } */
}
