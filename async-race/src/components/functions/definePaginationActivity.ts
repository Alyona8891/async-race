import WinnersView from '../app/view/main/winnersView/winnersView';

function definePaginationActivity(view: WinnersView): void {
  if (view.winsSort === 'Wins' && view.timeSort === 'Best time(seconds)') {
    console.log(1);
    view.createResultsView(view.currentPage, 'time', 'DESC', view.winsSort, view.timeSort)
      .then(() => {
        view.checkStatusActive(view.buttonPrev, view.buttonNext, view.maxPage, view.currentPage);
      });
  } else if (view.winsSort === '↓ Wins') {
    console.log(2);
    view.createResultsView(view.currentPage, 'wins', 'DESC', view.winsSort, view.timeSort)
      .then(() => {
        view.checkStatusActive(view.buttonPrev, view.buttonNext, view.maxPage, view.currentPage);
      });
  } else if (view.winsSort === '↑ Wins') {
    console.log(3);
    view.createResultsView(view.currentPage, 'wins', 'ASC', view.winsSort, view.timeSort)
      .then(() => {
        view.checkStatusActive(view.buttonPrev, view.buttonNext, view.maxPage, view.currentPage);
      });
  } else if (view.timeSort === '↓ Best time(seconds)') {
    console.log(1);
    view.createResultsView(view.currentPage, 'time', 'DESC', view.winsSort, view.timeSort)
      .then(() => {
        view.checkStatusActive(view.buttonPrev, view.buttonNext, view.maxPage, view.currentPage);
      });
  } else if (view.timeSort === '↑ Best time(seconds)') {
    view.createResultsView(view.currentPage, 'time', 'ASC', view.winsSort, view.timeSort)
      .then(() => {
        view.checkStatusActive(view.buttonPrev, view.buttonNext, view.maxPage, view.currentPage);
      });
  }
}
export default definePaginationActivity;
