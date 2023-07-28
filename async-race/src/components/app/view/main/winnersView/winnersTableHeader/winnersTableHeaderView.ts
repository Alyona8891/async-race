import './winnersTableHeader.css';
import View from '../../../view';
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
    this.addCreatedElement('div', ['winners-block__header-table', 'number'], '№', this.elementCreator);
    this.addCreatedElement('div', ['winners-block__header-table', 'car'], 'Car', this.elementCreator);
    this.addCreatedElement('div', ['winners-block__header-table', 'name'], 'Name', this.elementCreator);
    this.addCreatedElement('div', ['winners-block__header-table', 'wins', 'wins-sort'], winsSort, this.elementCreator);
    this.addCreatedElement('div', ['winners-block__header-table', 'time', 'time-sort'], timeSort, this.elementCreator);
  }
}
