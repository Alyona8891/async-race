import './header.css';
import { ParametersElementCreator } from '../../../../types/types';
import View from '../view';

export default class HeaderView extends View {
    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'header',
            tagClasses: ['page__page-header', 'page-header'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        // this.configView();
    }

    /* configView(): void {
    } */
}
