import FooterView from './view/footer/footerView';
import HeaderView from './view/header/headerView';
import MainView from './view/main/mainView';

export default class App {
    constructor() {
        App.createView();
    }

    static createView(): void {
        const mainView: MainView = new MainView();
        const headerView: HeaderView = new HeaderView(mainView);

        const footerView: FooterView = new FooterView();
        const createdHeaderView = headerView.getElementCreator();
        const createdMainView = mainView.getElementCreator();
        const createdFooterView = footerView.getElementCreator();
        if (createdHeaderView && createdMainView && createdFooterView) {
            document.body.append(createdHeaderView, createdMainView, createdFooterView);
        }
    }
}
