import './winnersTableHeader.css';
import View from '../../../view';
import ElementCreator from '../../../../../units/elementCreator';
import { ParametersElementCreator } from '../../../../../../types/types';

export default class WinnersTableHeaderView extends View {
    constructor(winsSort: string, timeSort: string) {
        const parameters: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__container'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.configView(winsSort, timeSort);
    }

    configView(winsSort: string, timeSort: string): void {
        const parametersTableHeaderNumber: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__header-table', 'number'],
            textContent: '№',
            callback: null,
        };
        const tableHeaderNumber = new ElementCreator(parametersTableHeaderNumber);
        this.elementCreator?.addInnerElement(tableHeaderNumber.getCreatedElement());
        const parametersTableHeaderCar: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__header-table', 'car'],
            textContent: 'Car',
            callback: null,
        };
        const tableHeaderCar = new ElementCreator(parametersTableHeaderCar);
        this.elementCreator?.addInnerElement(tableHeaderCar.getCreatedElement());
        const parametersTableHeaderName: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__header-table', 'name'],
            textContent: 'Name',
            callback: null,
        };
        const tableHeaderName = new ElementCreator(parametersTableHeaderName);
        this.elementCreator?.addInnerElement(tableHeaderName.getCreatedElement());
        const parametersTableHeaderWins: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__header-table', 'wins', 'wins-sort'],
            textContent: winsSort,
            callback: null,
        };
        const tableHeaderWins = new ElementCreator(parametersTableHeaderWins);
        this.elementCreator?.addInnerElement(tableHeaderWins.getCreatedElement());
        const parametersTableHeaderTime: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__header-table', 'time', 'time-sort'],
            textContent: timeSort,
            callback: null,
        };
        const tableHeaderTime = new ElementCreator(parametersTableHeaderTime);
        this.elementCreator?.addInnerElement(tableHeaderTime.getCreatedElement());
    }
}
