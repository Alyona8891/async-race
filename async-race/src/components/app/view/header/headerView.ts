import './header.css';
import { ParametersElementCreator } from '../../../../types/types';
import View from '../view';
import ElementCreator from '../../../units/elementCreator';
import LinkView from './link/linkView';
import GarageView from '../main/garageView/garageView';
import MainView from '../main/mainView';
import WinnersView from '../main/winnersView/winnersView';
import changeElementDisabling from '../../../functions/changeElementDisabling';
import definePaginationActivity from '../../../functions/definePaginationActivity';

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
    const creatorNav = this.createNavElement();
    const garageView = new GarageView();
    const winnersView = new WinnersView();
    this.createLinkElements(mainView, garageView, winnersView, creatorNav);
  }

  createNavElement(): ElementCreator {
    const parametersNav: ParametersElementCreator = {
      tag: 'nav',
      tagClasses: ['page-header__nav'],
      textContent: '',
      callback: null,
    };
    const creatorNav = new ElementCreator(parametersNav);
    this.elementCreator?.addInnerElement(creatorNav);
    return creatorNav;
  }

  createLinkElements(
    mainView: MainView,
    garageView: GarageView,
    winnersView: WinnersView,
    creatorNav: ElementCreator,
  ): void {
    const pagesParameters = [
      {
        name: NAME_PAGES.garage.toUpperCase(),
        callBack: {
          click: (event: Event | string): void => {
            this.handleGarageButton(event, garageView, mainView);
          },
        },
      },
      {
        name: NAME_PAGES.winners.toUpperCase(),
        callBack: {
          click: (event: Event | string): void => {
            this.handleWinnersButton(event, winnersView, mainView);
          },
        },
      },
    ];
    pagesParameters.forEach((el, index) => {
      const linkView = new LinkView(el, this.arrLinkElements);
      if (index === INDEX_START_PAGE) {
        el.callBack.click('click');
        linkView.setSelectedLink();
      }
      this.arrLinkElements.push(linkView);
      creatorNav.addInnerElement(linkView.getElementCreator());
    });
  }

  handleGarageButton(event: Event | string, garageView: GarageView, mainView: MainView): void {
    if (event instanceof Event) {
      const targetElement = event.target as HTMLButtonElement;
      this.makeGarageButtonDisabled(targetElement);
      mainView.redrawContent(garageView);
      changeElementDisabling('.reset', false);
    } else {
      mainView.redrawContent(garageView);
      changeElementDisabling('.reset', false);
    }
  }

  handleWinnersButton(event: Event | string, winnersView: WinnersView, mainView: MainView): void {
    if (event instanceof Event) {
      const targetElement = event.target as HTMLButtonElement;
      this.makeWinnersButtonDisabled(targetElement);
      definePaginationActivity(winnersView);
      mainView.redrawContent(winnersView);
    } else {
      definePaginationActivity(winnersView);
      mainView.redrawContent(winnersView);
    }
  }

  makeGarageButtonDisabled(targetElement: HTMLButtonElement): void {
    const newTargetElement = targetElement;
    if (newTargetElement) {
      const parent = newTargetElement?.closest('nav');
      const buttonToWinners = parent?.lastChild as HTMLButtonElement;
      buttonToWinners.disabled = false;
      newTargetElement.disabled = true;
    }
  }

  makeWinnersButtonDisabled(targetElement: HTMLButtonElement): void {
    const newTargetElement = targetElement;
    if (newTargetElement) {
      const parent = newTargetElement?.closest('nav');
      const buttonToGarage = parent?.firstChild as HTMLButtonElement;
      buttonToGarage.disabled = false;
      newTargetElement.disabled = true;
    }
  }
}
