import './header.css';
import { ParametersElementCreator } from '../../../../types/types';
import View from '../view';
import ElementCreator from '../../../units/elementCreator';
import LinkView from './link/linkView';

const NAME_PAGES = {
    garage: 'to garage',
    winners: 'to winners',
};
const INDEX_START_PAGE = 0;

export default class HeaderView extends View {
    arrLinkElements: LinkView[];

    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'header',
            tagClasses: ['page__page-header', 'page-header'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.arrLinkElements = [];
        this.configView();
    }

    configView(): void {
        const parametersNav: ParametersElementCreator = {
            tag: 'nav',
            tagClasses: ['page-header__nav'],
            textContent: '',
            callback: null,
        };
        const creatorNav = new ElementCreator(parametersNav);
        this.elementCreator?.addInnerElement(creatorNav);
        const pagesParameters = [
            {
                name: NAME_PAGES.garage.toLocaleUpperCase(),
                callBack: () => {},
            },
            {
                name: NAME_PAGES.winners.toLocaleUpperCase(),
                callBack: () => {},
            },
        ];
        pagesParameters.forEach((el, index) => {
            const linkView = new LinkView(el.name, this.arrLinkElements);
            this.arrLinkElements.push(linkView);
            if (index === INDEX_START_PAGE) {
                linkView.setSelectedLink();
            }
            creatorNav.addInnerElement(linkView.getElementCreator());
        });
    }
}
