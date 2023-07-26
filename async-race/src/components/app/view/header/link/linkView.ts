import { PageParameter, ParametersElementCreator } from '../../../../../types/types';
import View from '../../view';

export default class LinkView extends View {
    arrLinkElements: LinkView[];

    constructor(pageParameters: PageParameter, arrLinkElements: LinkView[]) {
        const parameters: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['page-header__link'],
            textContent: pageParameters.name,
            callback: pageParameters.callBack,
        };
        super(parameters);
        this.arrLinkElements = arrLinkElements;
        this.configView();
    }

    setSelectedLink(): void {
        this.arrLinkElements.forEach((linkElement) => linkElement.setUnselectedLink());
        const element = this.elementCreator;
        element?.getCreatedElement()?.classList.add('page-header__link_selected');
    }

    setUnselectedLink(): void {
        const element = this.elementCreator;
        element?.getCreatedElement()?.classList.remove('page-header__link_selected');
    }

    configView(): void {
        const element = this.elementCreator?.getCreatedElement();
        element?.addEventListener('click', this.setSelectedLink.bind(this));
    }
}
