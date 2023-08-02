import './footer.css';
import { ParametersElementCreator } from '../../../../types/types';
import View from '../view';

const INNER_BLOCK_INFO = `
<div class="page-footer__ghpage-block ghpage-block">
    <a class="ghpage-block__link" href="https://github.com/Alyona8891" target="_blank">Alyona Shupenyova</a>
</div>
<div class="page-footer__year">2023</div><div class="page-footer__rslink-block rslink-block">
    <a class="rslink-block__link" href="https://rs.school/js/" target="_blank">
        <img class="rslink-block__logo" src="https://rs.school/images/rs_school_js.svg" alt="rs logo">
    </a>
</div>`;

export default class FooterView extends View {
  constructor() {
    const parameters: ParametersElementCreator = {
      tag: 'footer',
      tagClasses: ['page__page-footer', 'page-footer'],
      textContent: '',
      callback: null,
    };
    super(parameters);
    this.configView();
  }

  configView(): void {
    let createdElement: HTMLElement | Element | null = null;
    if (this.elementCreator) {
      createdElement = this.elementCreator.getCreatedElement();
    }
    if (createdElement) {
      createdElement.innerHTML = INNER_BLOCK_INFO;
    }
  }
}
