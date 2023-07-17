import FooterView from './view/footer/footerView';
import HeaderView from './view/header/headerView';
import MainView from './view/main/mainView';

export default class App {
    constructor() {
        App.createView();
    }

    static createView(): void {
        const headerView: HeaderView = new HeaderView();
        const footerView: FooterView = new FooterView();
        const mainView: MainView = new MainView();
        const createdHeaderView = headerView.getElementCreator();
        const createdMainView = mainView.getElementCreator();
        const createdFooterView = footerView.getElementCreator();
        if (createdHeaderView && createdMainView && createdFooterView) {
            document.body.append(createdHeaderView, createdMainView, createdFooterView);
        }
    }
}
