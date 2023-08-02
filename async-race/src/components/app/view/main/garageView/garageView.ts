import {
  baseUrl, carBrands, carModels, path,
} from '../../../../../data/data';
import {
  DataDrive,
  DataDriveResult,
  GarageData,
  Car,
  ParametersElementCreator,
  Winner,
  MoveParameters,
} from '../../../../../types/types';
import clearInputsValues from '../../../../functions/clearInputsValues';
import changeElementDisabling from '../../../../functions/changeElementDisabling';
import ElementCreator from '../../../../units/elementCreator';
import InputCreator from '../../../../units/inputCreator/inputCreator';
import View from '../../view';
import './garage.css';
import RaceBlockView from './raceBlockView/raceBlockView';
import clearAllIntervals from '../../../../functions/clearAllIntervals';

const DEFAULT_COLOR = '#000000';
const COUNT_CARS_PAGE = 7;
const COUNT_CAR_MODELS = 10;
const WIDTH_CAR = 60;
const INTERVAL = 10;
const GENERATE_COUNT_CARS = 100;
const TIME_DIMINUTIVE = 1000;

export default class GarageView extends View {
  [key: string]: unknown;

  creatingField: string;

  updatingField: string;

  creatingFieldColor: string;

  updatingFieldColor: string;

  currentPage: number;

  raceBlock: RaceBlockView | null;

  updatingCarId: string;

  maxPage: number;

  modalWindow: HTMLElement | null;

  buttonNext: ElementCreator | null;

  buttonPrev: ElementCreator | null;

  constructor() {
    const parameters: ParametersElementCreator = {
      tag: 'section',
      tagClasses: ['page-main__garage-block', 'garage-block'],
      textContent: '',
      callback: {
        click: async (event: Event): Promise<void | Record<string, string>> => {
          const { target } = event;
          this.handleAccordingTypeTarget(target as HTMLElement);
          return {};
        },
      },
    };
    super(parameters);
    this.raceBlock = null;
    this.modalWindow = null;
    this.buttonNext = null;
    this.buttonPrev = null;
    this.creatingField = '';
    this.creatingFieldColor = DEFAULT_COLOR;
    this.updatingField = '';
    this.updatingFieldColor = DEFAULT_COLOR;
    this.updatingCarId = '';
    this.currentPage = 1;
    this.maxPage = 1;
    this.configView();
  }

  configView(): void {
    let inputBlock = this.addBlockCreatingCar();
    inputBlock = this.addBlockUpdatingCar();
    inputBlock?.querySelectorAll('input').forEach((el: HTMLInputElement) => {
      const newEl: HTMLInputElement = el;
      newEl.disabled = true;
    });
    const inputButton = inputBlock?.querySelector('button');
    if (inputButton) {
      inputButton.disabled = true;
    }
    this.addRaceButton();
    this.addResetButton();
    this.addGenerateCarButton();
    this.buttonPrev = this.addPaginationPrevButton();
    this.buttonNext = this.addPaginationNextButton();
    this.createGarageView(this.currentPage)
      .then(() => {
        if (this.buttonPrev && this.buttonNext) {
          this.changeBlockingBtns(this.buttonPrev, this.buttonNext, this.maxPage, this.currentPage);
        }
      });
    const modalWindow = this.addCreatedElement('div', ['garage-block__modal-window', 'garage-block__modal-window_unvisible'], '', this.elementCreator);
    this.modalWindow = modalWindow.getCreatedElement() as HTMLElement;
  }

  handleInputField(event: Event, inputField: string): void {
    if (event.target instanceof HTMLInputElement && !event.target.hasAttribute('type')) {
      (this as GarageView)[inputField] = event.target.value;
    }
    if (event.target instanceof HTMLInputElement && event.target.hasAttribute('type')) {
      this[`${inputField}Color`] = event.target.value;
    }
    if (event.target instanceof HTMLButtonElement) {
      this[`${inputField}Color`] = event.target.value;
    }
  }

  static async getCars(currentPage: number): Promise<GarageData | null> {
    let result: GarageData | null = null;
    try {
      const response = await fetch(`${baseUrl}${path.garage}?_page=${currentPage}&_limit=${COUNT_CARS_PAGE}`);
      const dataCarArr: Car[] = await response.json();
      const countCars = Number(response.headers.get('X-Total-Count'));
      const maxPage = Math.ceil(countCars / COUNT_CARS_PAGE);
      result = { data: dataCarArr.length ? dataCarArr : null, countCars, maxPage };
      return result;
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  static async getCar(idCar: number): Promise<Car | null> {
    let data: Car | null = null;
    try {
      const response = await fetch(`${baseUrl}${path.garage}/${idCar}`);
      data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    return data;
  }

  async createGarageView(currentPage: number): Promise<void> {
    try {
      changeElementDisabling('button', true);
      changeElementDisabling('input', true);
      const parametersRaceBlock = (await GarageView.getCars(this.currentPage)) as GarageData;
      changeElementDisabling('button', false);
      changeElementDisabling('input', false);
      changeElementDisabling('.block-garage__button_stopping', true);
      changeElementDisabling('.input-update input', true);
      changeElementDisabling('.input-update button', true);
      let raceBlock;
      if (parametersRaceBlock.countCars && parametersRaceBlock.data) {
        raceBlock = new RaceBlockView(
          parametersRaceBlock.data,
          parametersRaceBlock.countCars,
          currentPage,
        );
        this.raceBlock = raceBlock;
        this.maxPage = parametersRaceBlock.maxPage;
      }
      const raceBlockElement = raceBlock?.getElementCreator();
      if (raceBlockElement) {
        this.elementCreator?.addInnerElement(raceBlockElement);
      }
      if (this.buttonPrev && this.buttonNext) {
        this.changeBlockingBtns(this.buttonPrev, this.buttonNext, this.maxPage, this.currentPage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async createCar(body: Omit<Car, 'id'>): Promise<Car> {
    let car;
    try {
      const response = await fetch(`${baseUrl}${path.garage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      car = await response.json();
      return car;
    } catch (error) {
      console.log(error);
    }
    return car;
  }

  static async updateCar(id: string, name: string, color: string): Promise<Car> {
    let car;
    try {
      const response = await fetch(`${baseUrl}${path.garage}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `${name}`, color: `${color}` }),
      });
      car = await response.json();
      return car;
    } catch (error) {
      console.log(error);
    }
    return car;
  }

  static async deleteCar(id: number): Promise<object> {
    let carDeleted;
    try {
      const response = await fetch(`${baseUrl}${path.garage}/${id}`, {
        method: 'DELETE',
      });
      carDeleted = await response.json();
      return carDeleted;
    } catch (error) {
      console.log(error);
    }
    return carDeleted;
  }

  static getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  static getRandomNameCar(arr1: string[], arr2: string[]): string {
    let nameCar = '';
    nameCar += arr1[Math.floor(Math.random() * COUNT_CAR_MODELS)];
    nameCar += arr2[Math.floor(Math.random() * COUNT_CAR_MODELS)];
    return nameCar;
  }

  static createBody(modelCar: string, colorCar: string): Omit<Car, 'id'> {
    return { name: modelCar, color: colorCar };
  }

  static async startEngine(
    id: number,
    status: string,
  ): Promise<DataDriveResult> {
    const response = await fetch(`${baseUrl}${path.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    const data = await response.json();
    return { data, id };
  }

  static async createWinner(body: Winner): Promise<Winner> {
    let winner;
    try {
      const response = await fetch(`${baseUrl}${path.winners}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      winner = await response.json();
      return winner;
    } catch (error) {
      console.log(error);
    }
    return winner;
  }

  static createBodyWinner(idWin: number, winsWin: number, timeWin: number): Winner {
    return { id: idWin, wins: winsWin, time: timeWin };
  }

  static async getWinner(id: number): Promise<Winner> {
    let winner;
    try {
      const response = await fetch(`${baseUrl}${path.winners}/${id}`);
      winner = await response.json();
      return winner;
    } catch (error) {
      console.log(error);
    }
    return winner;
  }

  static async updateWinner(id: number, wins: number, time: number): Promise<Winner> {
    let updateWinner;
    try {
      const response = await fetch(`${baseUrl}${path.winners}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wins: `${wins}`, time: `${time}` }),
      });
      updateWinner = await response.json();
      return updateWinner;
    } catch (error) {
      console.log(error);
    }
    return updateWinner;
  }

  static async checkWinner(idWin: number, winsWin: number, timeWin: number): Promise<void> {
    try {
      const winner = await GarageView.getWinner(idWin);
      if (!winner.id) {
        await GarageView.createWinner(GarageView.createBodyWinner(idWin, 1, timeWin));
      } else {
        const winnerLastWins = winner.wins;
        const winnerNewWins = +winnerLastWins + 1;
        const winnerLastBestTime = winner.time;
        if (winnerLastBestTime < timeWin) {
          await GarageView.updateWinner(idWin, winnerNewWins, winnerLastBestTime);
        } else {
          await GarageView.updateWinner(idWin, winnerNewWins, timeWin);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteWinner(idWin: number): Promise<void> {
    try {
      const winner = await GarageView.getWinner(idWin);
      if (winner.id) {
        const response = await fetch(`${baseUrl}${path.winners}/${idWin}`, {
          method: 'DELETE',
        });
        await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleDeleteButton(target: HTMLElement): void {
    const parent = (target).closest('.block-garage');
    let garageBlockId: string | undefined;
    if (parent) {
      garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
    }
    if (garageBlockId) {
      GarageView.deleteCar(+garageBlockId)
        .then(() => {
          if (garageBlockId) {
            GarageView.deleteWinner(+garageBlockId);
          }
        }).then(() => {
          this.raceBlock?.deleteContent();
        }).then(() => {
          this.createGarageView(this.currentPage);
        });
    }
  }

  handleSelectButton(target: HTMLElement): void {
    const parent = (target as HTMLElement).closest('.block-garage');
    let garageBlockId;
    let garageBlock;
    let svgElementFill;
    let nameCar;
    if (parent) {
      garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
    }
    if (parent) {
      garageBlock = parent.querySelector('.block-garage__road-container');
      const svgElement = garageBlock?.querySelector('svg > g');
      svgElementFill = (svgElement as SVGElement).getAttribute('fill');
    }
    if (parent) {
      nameCar = parent.querySelector('span')?.innerText;
    }
    const inputsArr = document.querySelectorAll('input');
    const parentDiv = inputsArr[2].closest('div');
    const updateButton = parentDiv?.querySelector('button');
    if (updateButton) {
      updateButton.disabled = false;
    }
    inputsArr[2].disabled = false;
    if (nameCar && svgElementFill && garageBlockId) {
      inputsArr[2].value = nameCar;
      this.updatingField = nameCar;
      inputsArr[3].value = svgElementFill;
      inputsArr[3].disabled = false;
      this.updatingFieldColor = svgElementFill;
      this.updatingCarId = garageBlockId;
    }
  }

  async handleMovingButton(target: HTMLElement): Promise<void> {
    this.changeElementsDisableOnMove();
    (target as HTMLElement).setAttribute('disabled', '');
    const parent = (target as HTMLElement).closest('.block-garage') as HTMLElement | null;
    const stoppingButton = parent?.querySelector('.block-garage__button_stopping') as HTMLButtonElement | null | undefined;
    let parameters: undefined | MoveParameters;
    if (parent && stoppingButton) {
      parameters = this.getGarageBlockData(parent, stoppingButton);
    }
    let parametersMoving;
    let time;
    try {
      if (parameters?.garageBlockId) {
        parametersMoving = await GarageView.startEngine(+parameters.garageBlockId, 'started');
      }
    } catch (error) {
      console.log(error);
    }
    if (parametersMoving) {
      time = (parametersMoving.data.distance) / (parametersMoving.data.velocity);
    }
    let oneStep: number = 0;
    if (parameters?.roadLength && time) {
      oneStep = parameters.roadLength / (time / INTERVAL);
    }
    let carAnimation;
    if (parameters) {
      carAnimation = this.setCarAnimation(parameters, oneStep);
    }
    stoppingButton?.setAttribute('name', (carAnimation as NodeJS.Timer).toString());
    try {
      if (parameters?.garageBlockId) {
        await GarageView.startEngine(+parameters.garageBlockId, 'drive');
      }
    } catch {
      clearInterval(carAnimation);
    }
  }

  getGarageBlockData(parent: HTMLElement, stoppingButton: HTMLButtonElement): MoveParameters {
    let garageBlockId;
    let svgElement: SVGSVGElement | undefined | null;
    let roadLength: number = 0;
    if (parent && stoppingButton instanceof HTMLButtonElement) {
      garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
      const garageBlock = parent.querySelector('.block-garage__road-container') as HTMLDivElement;
      stoppingButton.removeAttribute('disabled');
      svgElement = garageBlock?.querySelector('svg');
      const garageBlockOffsetWidth = garageBlock?.offsetWidth;
      if (garageBlockOffsetWidth) {
        roadLength = garageBlockOffsetWidth - WIDTH_CAR;
      }
    }
    const result = { garageBlockId, svgElement, roadLength };
    return result;
  }

  setCarAnimation(parameters: MoveParameters, oneStep: number): NodeJS.Timer {
    const newParameters = parameters;
    let startPosition = 0;
    const carAnimation = setInterval(() => {
      if (newParameters?.svgElement && (startPosition < newParameters?.roadLength)) {
        startPosition += oneStep;
        newParameters.svgElement.style.left = `${startPosition}px`;
      }
    }, INTERVAL);
    return carAnimation;
  }

  changeElementsDisableOnMove(): void {
    changeElementDisabling('.garage-block__input-block button', true);
    changeElementDisabling('.garage-block > button', true);
    changeElementDisabling('.block-garage__select-button', true);
    changeElementDisabling('.block-garage__delete-button', true);
    changeElementDisabling('.reset', false);
    changeElementDisabling('input', true);
    changeElementDisabling('.input-update input', true);
    changeElementDisabling('.input-update button', true);
  }

  async handleStoppingButton(target: HTMLElement): Promise<void> {
    this.changeElementsDisableOnStop();
    if (this.buttonPrev && this.buttonNext) {
      this.changeBlockingBtns(
        this.buttonPrev,
        this.buttonNext,
        this.maxPage,
        this.currentPage,
      );
    }
    (target as HTMLElement).setAttribute('disabled', '');
    const parent = (target as HTMLElement).closest('.block-garage');
    const movingButton = parent?.querySelector('.block-garage__button_moving');
    let garageBlockId;
    let svgElement: SVGSVGElement | null | undefined;
    if (parent) {
      garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
      const garageBlock = parent.querySelector('.block-garage__road-container');
      svgElement = garageBlock?.querySelector('svg');
    }
    if (garageBlockId) {
      await GarageView.startEngine(+garageBlockId, 'stopped').then(() => {
        const intervalId = (target as HTMLElement).getAttribute('name');
        if (intervalId && svgElement && movingButton) {
          clearInterval(+intervalId);
          svgElement.style.left = '0px';
          (movingButton as HTMLButtonElement).disabled = false;
        }
      });
    }
  }

  changeElementsDisableOnStop(): void {
    changeElementDisabling('.garage-block__input-block button', false);
    changeElementDisabling('.garage-block > button', false);
    changeElementDisabling('input', false);
    changeElementDisabling('.input-update input', true);
    changeElementDisabling('.input-update button', true);
    changeElementDisabling('.block-garage__select-button', false);
    changeElementDisabling('.block-garage__delete-button', false);
  }

  handleAccordingTypeTarget(target: HTMLElement): void {
    if (target && (target as HTMLElement).classList.contains('block-garage__delete-button')) {
      this.handleDeleteButton(target as HTMLElement);
    }
    if ((target as HTMLElement).classList.contains('block-garage__select-button')) {
      this.handleSelectButton(target as HTMLElement);
    }
    if ((target as HTMLElement).classList.contains('block-garage__button_moving')) {
      this.handleMovingButton(target as HTMLElement);
    }
    if ((target as HTMLElement).classList.contains('block-garage__button_stopping')) {
      this.handleStoppingButton(target as HTMLElement);
    }
  }

  handleButtonRace(): void {
    const roadContainerElementsArr = document.querySelectorAll('.block-garage__road-container');
    const roadLength = (roadContainerElementsArr[0] as HTMLElement).offsetWidth - WIDTH_CAR;
    const arrElementsId: number[] = [];
    const svgElementsList = document.querySelectorAll(
      '.block-garage__road-container > svg',
    ) as NodeList;
    const svgElementsArr = Array.from(svgElementsList) as HTMLElement[];
    roadContainerElementsArr.forEach((el) => arrElementsId.push(+el.id));
    const arrPromisesStarted: Promise<DataDriveResult>[] | undefined = arrElementsId.map(
      (el) => new Promise((resolve, reject) => {
        changeElementDisabling('button', true);
        changeElementDisabling('.page-header__link', true);
        changeElementDisabling('input', true);
        fetch(`${baseUrl}${path.engine}?id=${el}&status=started`, {
          method: 'PATCH',
        })
          .then((response) => response.json())
          .then((dataResp: DataDrive): DataDriveResult => {
            changeElementDisabling('.page-header__link', false);
            return { data: dataResp, id: el };
          })
          .then((data: DataDriveResult) => resolve(data))
          .catch((error) => {
            reject(error);
          });
      }),
    );
    this.raceCars(arrPromisesStarted, arrElementsId, svgElementsArr, roadLength);
  }

  async raceCars(
    arrPromisesStarted: Promise<DataDriveResult>[],
    arrElementsId: number[],
    svgElementsList: Element[],
    roadLength: number,
  ): Promise<void> {
    Promise.all(arrPromisesStarted as Promise<DataDriveResult>[]).then(async (values) => {
      const requestsResult = arrElementsId.map(async (el: number, i: number) => {
        let startPosition = 0;
        const newEl = svgElementsList[i];
        const timeEl = (values[i] as DataDriveResult).data.distance
                              / (values[i] as DataDriveResult).data.velocity;
        const carAnimation = setInterval(() => {
          const oneStep = roadLength / (timeEl / INTERVAL);
          if (startPosition < roadLength) {
            startPosition += oneStep;
            (newEl as HTMLElement).style.left = `${startPosition}px`;
          }
        }, INTERVAL);
        try {
          const result: DataDriveResult = (await GarageView.startEngine(
            +el,
            'drive',
          )) as DataDriveResult;
          result.time = (
            (values[i] as DataDriveResult).data.distance
                                  / (values[i] as DataDriveResult).data.velocity
                                  / TIME_DIMINUTIVE
          ).toFixed(2);
          return result;
        } catch (error) {
          clearInterval(carAnimation);
          throw error;
        }
      });
      this.getWinnerData(requestsResult);
    });
  }

  async getWinnerData(requestsResult: Promise<DataDriveResult>[]): Promise<void> {
    Promise.any(requestsResult)
      .then(async (data) => {
        changeElementDisabling('.reset', false);
        const idWinner = data.id;
        const winnerTime = data.time;
        const dataCar = await GarageView.getCar(idWinner);
        return { idWinner, winnerTime, dataCar };
      })
      .then((data) => {
        if (data.winnerTime) {
          if (this.modalWindow && this.modalWindow instanceof HTMLElement) {
            this.modalWindow.classList.remove('garage-block__modal-window_unvisible');
            this.modalWindow.textContent = `${data.dataCar?.name} went first! Time: ${data.winnerTime}`;
          }
          GarageView.checkWinner(data.idWinner, data.idWinner, +data.winnerTime);
        }
      });
  }

  handleButtonReset(): void {
    const roadContainerElementsArr = document.querySelectorAll('.block-garage__road-container');
    const arrElementsId: string[] = [];
    const svgElementsList = document.querySelectorAll(
      '.block-garage__road-container > svg',
    ) as unknown as HTMLElement[];
    roadContainerElementsArr.forEach((el) => arrElementsId.push(el.id));
    const requests = arrElementsId.map(
      (el) => new Promise((resolve, reject) => {
        changeElementDisabling('button', true);
        changeElementDisabling('input', true);
        fetch(`${baseUrl}${path.engine}?id=${el}&status=stopped`, {
          method: 'PATCH',
        })
          .then((response) => response.json())
          .then((data) => resolve(data))
          .catch((error) => {
            reject(error);
          });
      }),
    );
    Promise.all(requests).then(() => {
      this.changeElementsDisablingReset();
      if (this.buttonPrev && this.buttonNext) {
        this.changeBlockingBtns(
          this.buttonPrev,
          this.buttonNext,
          this.maxPage,
          this.currentPage,
        );
      }
      this.modalWindow?.classList.add('garage-block__modal-window_unvisible');
      svgElementsList.forEach(async (el) => {
        const newEl = el;
        clearAllIntervals();
        newEl.style.left = '0px';
      });
    });
  }

  changeElementsDisablingReset(): void {
    changeElementDisabling('button', false);
    changeElementDisabling('input', false);
    changeElementDisabling('.block-garage__button_stopping', true);
    changeElementDisabling('.input-update input', true);
    changeElementDisabling('.input-update button', true);
  }

  addBlockCreatingCar(): HTMLElement | Element | undefined | null {
    const inputParameters: ParametersElementCreator = {
      tag: 'div',
      tagClasses: ['garage-block__input-block', 'input-create'],
      textContent: '',
      callback: {
        keyup: (event) => this.handleInputField(event, 'creatingField'),
        change: (event) => this.handleInputField(event, 'creatingField'),
        click: async (event) => {
          const targetElement = event.target as HTMLElement;
          if (targetElement instanceof HTMLButtonElement && this.creatingField) {
            GarageView.createCar({ name: this.creatingField, color: this.creatingFieldColor })
              .then(() => {
                this.raceBlock?.deleteContent();
                this.createGarageView(this.currentPage);
              }).then(() => {
                this.creatingField = '';
                clearInputsValues(targetElement);
              });
          }
        },
      },
      buttonName: 'create',
    };
    const inputBlock = new InputCreator(inputParameters);
    this.elementCreator?.addInnerElement(inputBlock.getCreatedElement());
    return inputBlock?.getCreatedElement();
  }

  addBlockUpdatingCar(): HTMLElement | Element | undefined | null {
    const inputParameters = {
      tag: 'div',
      tagClasses: ['garage-block__input-block', 'input-update'],
      textContent: '',
      callback: {
        keyup: (event: Event): void => this.handleInputField(event, 'updatingField'),
        change: (event: Event): void => this.handleInputField(event, 'updatingField'),
        click: (event: Event): void => {
          const targetElement = event.target;
          if (targetElement instanceof HTMLButtonElement) {
            GarageView.updateCar(this.updatingCarId, this.updatingField, this.updatingFieldColor)
              .then(() => {
                this.raceBlock?.deleteContent();
                this.createGarageView(this.currentPage);
              });
            const inputsArr = document.querySelectorAll('input');
            inputsArr[2].value = '';
            inputsArr[3].value = DEFAULT_COLOR;
            [targetElement, inputsArr[2], inputsArr[3]].forEach((el) => {
              const newEl = el;
              if (newEl) {
                newEl.disabled = true;
              }
            });
          }
        },
      },
      buttonName: 'update',
    };
    const inputBlock = new InputCreator(inputParameters);
    this.elementCreator?.addInnerElement(inputBlock);
    return inputBlock?.getCreatedElement();
  }

  addRaceButton(): void {
    const parametersRaceButton: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['garage-block__button'],
      textContent: 'RACE',
      callback: {
        click: () => {
          this.handleButtonRace();
        },
      },
    };
    const raceButton = new ElementCreator(parametersRaceButton);
    this.elementCreator?.addInnerElement(raceButton.getCreatedElement());
  }

  addResetButton(): void {
    const parametersResetButton: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['garage-block__button', 'reset'],
      textContent: 'RESET',
      callback: {
        click: () => {
          this.handleButtonReset();
        },
      },
    };
    const resetButton = new ElementCreator(parametersResetButton);
    this.elementCreator?.addInnerElement(resetButton.getCreatedElement());
  }

  addGenerateCarButton(): void {
    const parametersGenerateCarsButton: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['garage-block__button'],
      textContent: 'GENERATE CARS',
      callback: {
        click: async (event) => {
          try {
            const targetElement = event.target as HTMLButtonElement;
            targetElement.disabled = true;
            this.raceBlock?.deleteContent();
            const arr = new Array(GENERATE_COUNT_CARS).fill(1);
            const requestsResult = arr.map(async () => {
              const modelCar = GarageView.getRandomNameCar(carBrands, carModels);
              const colorCar = GarageView.getRandomColor();
              await GarageView.createCar(GarageView.createBody(modelCar, colorCar));
            });
            await Promise.all(requestsResult);
            await this.createGarageView(this.currentPage);
            targetElement.disabled = false;
            if (this.buttonPrev && this.buttonNext) {
              this.changeBlockingBtns(
                this.buttonPrev,
                this.buttonNext,
                this.maxPage,
                this.currentPage,
              );
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    };
    const generateCarsButton = new ElementCreator(parametersGenerateCarsButton);
    this.elementCreator?.addInnerElement(generateCarsButton.getCreatedElement());
  }

  addPaginationPrevButton(): ElementCreator {
    const parametersButtonPrev: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['winner-block__pagination-prev', 'pagination-prev'],
      textContent: 'Prev Page',
      callback: {
        click: async () => {
          if (this.currentPage !== 1) {
            this.currentPage -= 1;
            this.raceBlock?.deleteContent();
            await this.createGarageView(this.currentPage)
              .then(() => {
                if (this.buttonPrev && this.buttonNext) {
                  this.changeBlockingBtns(
                    this.buttonPrev,
                    this.buttonNext,
                    this.maxPage,
                    this.currentPage,
                  );
                }
              });
          }
        },
      },
    };
    const buttonPrev = new ElementCreator(parametersButtonPrev);
    this.elementCreator?.addInnerElement(buttonPrev.getCreatedElement());
    return buttonPrev;
  }

  addPaginationNextButton(): ElementCreator {
    const parametersButtonNext: ParametersElementCreator = {
      tag: 'button',
      tagClasses: ['garage-block__pagination-next', 'pagination-next'],
      textContent: 'Next Page',
      callback: {
        click: async () => {
          if (this.currentPage !== this.maxPage) {
            this.currentPage += 1;
            this.raceBlock?.deleteContent();
            await this.createGarageView(this.currentPage)
              .then(() => {
                if (this.buttonPrev && this.buttonNext) {
                  this.changeBlockingBtns(
                    this.buttonPrev,
                    this.buttonNext,
                    this.maxPage,
                    this.currentPage,
                  );
                }
              });
          }
        },
      },
    };
    const buttonNext = new ElementCreator(parametersButtonNext);
    this.elementCreator?.addInnerElement(buttonNext.getCreatedElement());
    return buttonNext;
  }
}
