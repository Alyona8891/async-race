import './oneTableLine.css';
import { ParametersElementCreator } from '../../../../../../../types/types';
import ElementCreator from '../../../../../../units/elementCreator';
import View from '../../../../view';
import { carElementString } from '../../../../../../../data/data';
import changeFillSize from '../../../../../../functions/changeFill';

export default class OneTablelineView extends View {
    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['winners-block__container'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.configView(1, '#ffffff', 'Mazda', 5, 5);
    }

    configView(number, color, nameCar, winsCount, time): void {
        const parametersTableLineNumber: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__table-line', 'number'],
            textContent: number,
            callback: null,
        };
        const tableLineNumber = new ElementCreator(parametersTableLineNumber);
        this.elementCreator?.addInnerElement(tableLineNumber.getCreatedElement());
        const parametersTableLineCar: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__table-line', 'car'],
            textContent: '',
            callback: null,
        };
        const tableLinerCar = new ElementCreator(parametersTableLineCar);
        tableLinerCar.getCreatedElement()?.insertAdjacentHTML('beforeend', changeFillSize(carElementString, color, 30));
        this.elementCreator?.addInnerElement(tableLinerCar.getCreatedElement());
        const parametersTableLineName: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__table-line', 'name'],
            textContent: nameCar,
            callback: null,
        };
        const tableLineName = new ElementCreator(parametersTableLineName);
        this.elementCreator?.addInnerElement(tableLineName.getCreatedElement());
        const parametersTablelineWins: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__table-line', 'wins', 'wins-sort'],
            textContent: winsCount,
            callback: null,
        };
        const tableLineWins = new ElementCreator(parametersTablelineWins);
        this.elementCreator?.addInnerElement(tableLineWins.getCreatedElement());
        const parametersTableLineTime: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__table-line', 'time', 'time-sort'],
            textContent: time,
            callback: null,
        };
        const tableLineTime = new ElementCreator(parametersTableLineTime);
        this.elementCreator?.addInnerElement(tableLineTime.getCreatedElement());
    }
}
