import './header.css';
import { ParametersElementCreator } from '../../../../types/types';
import View from '../view';
import ElementCreator from '../../../units/elementCreator';
import LinkView from './link/linkView';
import GarageView from '../main/garageView/garageView';
import MainView from '../main/mainView';
import WinnersView from '../main/winnersView/winnersView';

const NAME_PAGES = {
    garage: 'to garage',
    winners: 'to winners',
};
const INDEX_START_PAGE = 0;

export default class HeaderView extends View {
    arrLinkElements: LinkView[];

    constructor(mainView: MainView) {
        const parameters: ParametersElementCreator = {
            tag: 'header',
            tagClasses: ['page__page-header', 'page-header'],
            textContent: '',
            callback: null,
        };
        super(parameters);
        this.arrLinkElements = [];
        this.configView(mainView);
    }

    configView(mainView: MainView): void {
        const parametersNav: ParametersElementCreator = {
            tag: 'nav',
            tagClasses: ['page-header__nav'],
            textContent: '',
            callback: null,
        };
        const creatorNav = new ElementCreator(parametersNav);
        this.elementCreator?.addInnerElement(creatorNav);
        const garageView = new GarageView();
        const pagesParameters = [
            {
                name: NAME_PAGES.garage.toLocaleUpperCase(),
                callBack: {
                    click: () => {
                        mainView.redrawContent(garageView);
                    },
                },
            },
            {
                name: NAME_PAGES.winners.toLocaleUpperCase(),
                callBack: {
                    click: () => {
                        mainView.redrawContent(new WinnersView());
                    },
                },
            },
        ];
        pagesParameters.forEach((el, index) => {
            const linkView = new LinkView(el, this.arrLinkElements);
            this.arrLinkElements.push(linkView);
            if (index === INDEX_START_PAGE) {
                el.callBack.click();
                linkView.setSelectedLink();
            }
            creatorNav.addInnerElement(linkView.getElementCreator());
        });
    }
}
