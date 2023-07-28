import './winners.css';
import { ParametersElementCreator, WinnersData } from '../../../../../types/types';
import View from '../../view';
import ElementCreator from '../../../../units/elementCreator';
import { baseUrl, path } from '../../../../../data/data';
import ResultsBlockView from './resultsBlockView/resultsBlockView';

export default class WinnersView extends View {
  maxPage: number;

  currentPage: number;

  resultsBlock!: ResultsBlockView;

  winsSort: string;

  timeSort: string;

  buttonNext!: ElementCreator;

  buttonPrev!: ElementCreator;

  constructor() {
    const parameters: ParametersElementCreator = {
      tag: 'section',
      tagClasses: ['page-main__winners-block', 'winners-block'],
      textContent: '',
      callback: {
        click: async (event: Event): Promise<void | Record<string, string>> => {
          const targetElement = event.target;
          if ((targetElement as HTMLElement).classList.contains('wins-sort')) {
            this.timeSort = 'Best time(seconds)';
            if (this.winsSort === 'Wins') {
              this.winsSort = '↓ Wins';
              this.resultsBlock.deleteContent();
              this.createResultsView(this.currentPage, 'wins', 'DESC', this.winsSort, this.timeSort);
            } else if (this.winsSort === '↓ Wins') {
              this.winsSort = '↑ Wins';
              this.resultsBlock.deleteContent();
              await this.createResultsView(this.currentPage, 'wins', 'ASC', this.winsSort, this.timeSort);
            } else if (this.winsSort === '↑ Wins') {
              this.winsSort = '↓ Wins';
              this.resultsBlock.deleteContent();
              await this.createResultsView(
                this.currentPage,
                'wins',
                'DESC',
                this.winsSort,
                this.timeSort,
              );
            }
          }
          if ((targetElement as HTMLElement).classList.contains('time-sort')) {
            this.winsSort = 'Wins';
            if (this.timeSort === 'Best time(seconds)') {
              this.timeSort = '↓ Best time(seconds)';
              console.log(this.winsSort, this.timeSort);
              this.resultsBlock.deleteContent();
              this.createResultsView(this.currentPage, 'time', 'DESC', this.winsSort, this.timeSort);
            } else if (this.timeSort === '↓ Best time(seconds)') {
              this.timeSort = '↑ Best time(seconds)';
              console.log(this.winsSort, this.timeSort);
              this.resultsBlock.deleteContent();
              await this.createResultsView(this.currentPage, 'time', 'ASC', this.winsSort, this.timeSort);
            } else if (this.timeSort === '↑ Best time(seconds)') {
              this.timeSort = '↓ Best time(seconds)';
              console.log(this.winsSort, this.timeSort);
              this.resultsBlock.deleteContent();
              await this.createResultsView(
                this.currentPage,
                'time',
                'DESC',
                this.winsSort,
                this.timeSort,
              );
            }
          }
        },
      },
    };
    super(parameters);
    this.currentPage = 1;
    this.maxPage = 1;
    this.winsSort = 'Wins';
    this.timeSort = 'Best time(seconds)';
    this.configView();
  }

  configView(): void {
    let buttonPrev;
    let buttonNext;
    const parametersButtonPrev: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['garage-block__pagination-prev'],
      textContent: 'Prev Page',
      callback: {
        click: () => {
          if (this.currentPage !== 1) {
            this.currentPage -= 1;
            this.resultsBlock.deleteContent();
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
            this.checkStatusActive(buttonPrev, buttonNext, this.maxPage, this.currentPage);
          }
        },
      },
    };
    buttonPrev = new ElementCreator(parametersButtonPrev);
    this.buttonPrev = buttonPrev;
    this.elementCreator?.addInnerElement(buttonPrev.getCreatedElement());
    const parametersButtonNext: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['garage-block__pagination-next'],
      textContent: 'Next Page',
      callback: {
        click: () => {
          if (this.currentPage !== this.maxPage) {
            this.currentPage += 1;
            this.resultsBlock.deleteContent();
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
            this.checkStatusActive(buttonPrev, buttonNext, this.maxPage, this.currentPage);
          }
        },
      },
    };
    buttonNext = new ElementCreator(parametersButtonNext);
    this.buttonNext = buttonNext;
    this.elementCreator?.addInnerElement(buttonNext.getCreatedElement());
    this.createResultsView(this.currentPage, 'time', 'DESC', this.winsSort, this.timeSort).then(() => this.checkStatusActive(buttonPrev, buttonNext, this.maxPage, this.currentPage));
  }

  static async getWinners(currentPage: number, sortParameter: string, orderParameter: string): Promise<WinnersData> {
    let resultData;
    try {
      const response = await fetch(
        `${baseUrl}${path.winners}?_page=${currentPage}&_limit=10&_sort=${sortParameter}&_order=${orderParameter}`,
      );
      const data = await response.json();
      const count = Number(await response.headers.get('X-Total-Count'));
      const page = Math.ceil(count / 10);
      resultData = { dataWinners: data, countWinners: count, maxPage: page };
    } catch (error) {
      console.log(error);
    }
    return resultData;
  }

  async createResultsView(
    currentPage,
    sortParameter,
    orderParameter,
    winsSort: string,
    timeSort: string,
  ): Promise<void> {
    try {
      this.deleteContent();
      const parametersRaceBlock = await WinnersView.getWinners(
        currentPage,
        sortParameter,
        orderParameter,
      );
      const parametersResultBlock = parametersRaceBlock.dataWinners.map(async (el) => {
        const dataOneCar = await ResultsBlockView.getOneCar(el.id);
        return {
          colorWinner: dataOneCar.color,
          nameWinner: dataOneCar.name,
          winsWinner: el.wins,
          timeWinner: el.time,
        };
      });
      const countCarsData = parametersRaceBlock.countWinners;
      const maxPageData = parametersRaceBlock.maxPage;
      Promise.all(parametersResultBlock)
        .then((data) => {
          if (countCarsData) {
            this.resultsBlock = new ResultsBlockView(
              data,
              countCarsData,
              currentPage,
              winsSort,
              timeSort,
            );
            this.maxPage = maxPageData;
          }
          this.elementCreator?.addInnerElement(this.resultsBlock.getElementCreator());
        });
    } catch (error) {
      console.log(error);
    }
  }

  deleteContent(): void {
    const htmlElement = this.elementCreator?.getCreatedElement();
    console.log(htmlElement?.lastElementChild);
    while (htmlElement?.lastElementChild?.classList.contains('results-block')) {
      console.log('jjj');
      htmlElement.lastElementChild.remove();
    }
  }
}
