import './winners.css';
import { ParametersElementCreator, ParametersResultBlock, Winners } from '../../../../../types/types';
import View from '../../view';
import ElementCreator from '../../../../units/elementCreator';
import { baseUrl, path } from '../../../../../data/data';
import ResultsBlockView from './resultsBlockView/resultsBlockView';

const COUNT_WINNERS_PAGE = 10;

export default class WinnersView extends View {
  maxPage: number;

  currentPage: number;

  resultsBlock: ResultsBlockView | null;

  winsSort: string;

  timeSort: string;

  buttonNext: ElementCreator | null;

  buttonPrev: ElementCreator | null;

  constructor() {
    const parameters: ParametersElementCreator = {
      tag: 'section',
      tagClasses: ['page-main__winners-block', 'winners-block'],
      textContent: '',
      callback: {
        click: async (event: Event): Promise<void | Record<string, string>> => {
          const targetElement = event.target;
          if ((targetElement as HTMLElement).classList.contains('wins-sort')) {
            this.handleSortWins();
          }
          if ((targetElement as HTMLElement).classList.contains('time-sort')) {
            this.handleSortTime();
          }
        },
      },
    };
    super(parameters);
    this.currentPage = 1;
    this.maxPage = 1;
    this.winsSort = 'Wins';
    this.timeSort = 'Best time(seconds)';
    this.buttonNext = null;
    this.buttonPrev = null;
    this.resultsBlock = null;
    this.configView();
  }

  configView(): void {
    const parametersButtonPrev: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['winner-block__pagination-prev', 'pagination-prev'],
      textContent: 'Prev Page',
      callback: {
        click: () => {
          if (this.currentPage !== 1) {
            this.currentPage -= 1;
            this.createResultsViewWithCondition();
          }
        },
      },
    };
    this.buttonPrev = new ElementCreator(parametersButtonPrev);
    this.elementCreator?.addInnerElement(this.buttonPrev.getCreatedElement());
    const parametersButtonNext: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['winner-block__pagination-next', 'pagination-next'],
      textContent: 'Next Page',
      callback: {
        click: () => {
          if (this.currentPage !== this.maxPage) {
            this.currentPage += 1;
            this.createResultsViewWithCondition();
          }
        },
      },
    };
    this.buttonNext = new ElementCreator(parametersButtonNext);
    this.elementCreator?.addInnerElement(this.buttonNext.getCreatedElement());
    this.createResultsView(this.currentPage, 'time', 'DESC', this.winsSort, this.timeSort)
      .then(() => {
        if (this.buttonPrev && this.buttonNext) {
          this.changeBlockingBtns(this.buttonPrev, this.buttonNext, this.maxPage, this.currentPage);
        }
      });
  }

  handleSortWins(): void {
    this.timeSort = 'Best time(seconds)';
    if (this.winsSort === 'Wins') {
      this.winsSort = '↓ Wins';
      this.resultsBlock?.deleteContent();
      this.createResultsView(
        this.currentPage,
        'wins',
        'DESC',
        this.winsSort,
        this.timeSort,
      );
    } else if (this.winsSort === '↓ Wins') {
      this.winsSort = '↑ Wins';
      this.resultsBlock?.deleteContent();
      this.createResultsView(
        this.currentPage,
        'wins',
        'ASC',
        this.winsSort,
        this.timeSort,
      );
    } else if (this.winsSort === '↑ Wins') {
      this.winsSort = '↓ Wins';
      this.resultsBlock?.deleteContent();
      this.createResultsView(
        this.currentPage,
        'wins',
        'DESC',
        this.winsSort,
        this.timeSort,
      );
    }
  }

  handleSortTime(): void {
    this.winsSort = 'Wins';
    if (this.timeSort === 'Best time(seconds)') {
      this.timeSort = '↓ Best time(seconds)';
      this.createResultsView(
        this.currentPage,
        'time',
        'DESC',
        this.winsSort,
        this.timeSort,
      );
    } else if (this.timeSort === '↓ Best time(seconds)') {
      this.timeSort = '↑ Best time(seconds)';
      this.createResultsView(
        this.currentPage,
        'time',
        'ASC',
        this.winsSort,
        this.timeSort,
      );
    } else if (this.timeSort === '↑ Best time(seconds)') {
      this.timeSort = '↓ Best time(seconds)';
      this.createResultsView(
        this.currentPage,
        'time',
        'DESC',
        this.winsSort,
        this.timeSort,
      );
    }
  }

  static async getWinners(
    currentPage: number,
    sortParameter: string,
    orderParameter: string,
  ): Promise<Winners | undefined> {
    let resultData;
    try {
      const response = await fetch(
        `${baseUrl}${path.winners}?_page=${currentPage}&_limit=${COUNT_WINNERS_PAGE}&_sort=${sortParameter}&_order=${orderParameter}`,
      );
      const data = await response.json();
      const count = Number(response.headers.get('X-Total-Count'));
      const page = Math.ceil(count / COUNT_WINNERS_PAGE);
      resultData = { dataWinners: data, countWinners: count, maxPage: page };
    } catch (error) {
      console.log(error);
    }
    return resultData;
  }

  async createResultsView(
    currentPage: number,
    sortParameter: string,
    orderParameter: string,
    winsSort: string,
    timeSort: string,
  ): Promise<void> {
    try {
      this.deleteContent();
      const parameters = await WinnersView.getWinners(currentPage, sortParameter, orderParameter);
      const parametersResultBlock:
      Promise<ParametersResultBlock>[] | undefined = parameters?.dataWinners.map(async (el) => {
        const dataCar = await ResultsBlockView.getCar(el.id);
        return {
          colorWinner: dataCar.color,
          nameWinner: dataCar.name,
          winsWinner: el.wins,
          timeWinner: el.time,
        };
      });
      const countCarsData = parameters?.countWinners;
      const maxPageData = parameters?.maxPage;
      Promise.all(parametersResultBlock as Promise<ParametersResultBlock>[])
        .then((data) => {
          if (countCarsData && maxPageData) {
            this.resultsBlock = new ResultsBlockView(
              data,
              countCarsData,
              currentPage,
              winsSort,
              timeSort,
            );
            this.maxPage = maxPageData;
          }
          this.elementCreator?.addInnerElement(this.resultsBlock?.getElementCreator());
        });
    } catch (error) {
      console.log(error);
    }
  }

  deleteContent(): void {
    const htmlElement = this.elementCreator?.getCreatedElement();
    while (htmlElement?.lastElementChild?.classList.contains('results-block')) {
      htmlElement.lastElementChild.remove();
    }
  }

  createResultsViewWithCondition(): void {
    if (this.winsSort === 'Wins' && this.timeSort === 'Best time(seconds)') {
      this.createResultsView(this.currentPage, 'time', 'DESC', this.winsSort, this.timeSort);
    } else if (this.winsSort === '↓ Wins') {
      this.createResultsView(this.currentPage, 'wins', 'DESC', this.winsSort, this.timeSort);
    } else if (this.winsSort === '↑ Wins') {
      this.createResultsView(this.currentPage, 'wins', 'ASC', this.winsSort, this.timeSort);
    } else if (this.timeSort === '↓ Best time(seconds)') {
      this.createResultsView(this.currentPage, 'time', 'DESC', this.winsSort, this.timeSort);
    } else if (this.timeSort === '↑ Best time(seconds)') {
      this.createResultsView(this.currentPage, 'time', 'ASC', this.winsSort, this.timeSort);
    }
    if (this.buttonPrev && this.buttonNext) {
      this.changeBlockingBtns(
        this.buttonPrev,
        this.buttonNext,
        this.maxPage,
        this.currentPage,
      );
    }
  }
}
