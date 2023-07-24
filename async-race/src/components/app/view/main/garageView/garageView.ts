import { baseUrl, carBrands, carModels, path } from '../../../../../data/data';
import {
    DataDriveResult,
    GarageViewData,
    ParametersElementCreator,
    ParametersInputCreator,
} from '../../../../../types/types';
import ElementCreator from '../../../../units/elementCreator';
import InputCreator from '../../../../units/inputCreator/inputCreator';
import View from '../../view';
import './garage.css';
import RaceBlockView from './raceBlockView/raceBlockView';

export default class GarageView extends View {
    creatingField: string;

    updatingField: string;

    creatingFieldColor: string;

    updatingFieldColor: string;

    currentPage: number;

    raceBlock!: RaceBlockView;

    updatingCarId: string;

    maxPage: number;

    timeValues: Record<string, string>[] | unknown[];

    constructor() {
        const parameters: ParametersElementCreator = {
            tag: 'section',
            tagClasses: ['page-main__garage-block', 'garage-block'],
            textContent: '',
            callback: {
                click: async (event: Event): Promise<void | Record<string, string>> => {
                    const { target } = event;
                    if ((target as HTMLElement).classList.contains('block-garage__delete-button')) {
                        const parent = (target as HTMLElement).closest('.block-garage');
                        let garageBlockId;
                        if (parent) {
                            garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
                        }
                        GarageView.deleteCar(garageBlockId);
                        this.raceBlock.deleteContent();
                        this.createGarageView(this.currentPage);
                    }
                    if ((target as HTMLElement).classList.contains('block-garage__select-button')) {
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
                            const svgElement = garageBlock.querySelector('svg > g');
                            svgElementFill = (svgElement as SVGElement).getAttribute('fill');
                        }
                        if (parent) {
                            nameCar = parent.querySelector('span')?.innerText;
                        }
                        const inputsArr = document.querySelectorAll('input');
                        inputsArr[2].value = nameCar;
                        this.updatingField = nameCar;
                        inputsArr[3].value = svgElementFill;
                        this.updatingFieldColor = svgElementFill;
                        this.updatingCarId = garageBlockId;
                    }
                    if ((target as HTMLElement).classList.contains('block-garage__button_moving')) {
                        (target as HTMLElement).setAttribute('disabled', '');
                        const parent = (target as HTMLElement).closest('.block-garage');
                        let garageBlockId;
                        let svgElement;
                        if (parent) {
                            garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
                            const garageBlock = parent.querySelector('.block-garage__road-container');
                            svgElement = garageBlock?.querySelector('svg');
                        }
                        const parametersMoving = await GarageView.startEngine(garageBlockId, 'started');
                        const time =
                            (await parametersMoving.data.distance) / (await parametersMoving.data.velocity) / 1000;
                        (svgElement as HTMLElement).style.animation = `moving ${await time}s linear forwards`;
                        try {
                            await GarageView.startEngine(garageBlockId, 'drive');
                        } catch {
                            (svgElement as HTMLElement).style.animationPlayState = 'paused';
                        }
                    }
                    if ((target as HTMLElement).classList.contains('block-garage__button_stopping')) {
                        (target as HTMLElement).setAttribute('disabled', '');
                        const parent = (target as HTMLElement).closest('.block-garage');
                        let garageBlockId;
                        let svgElement;
                        if (parent) {
                            garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
                            const garageBlock = parent.querySelector('.block-garage__road-container');
                            svgElement = garageBlock?.querySelector('svg');
                        }
                        await GarageView.startEngine(garageBlockId, 'stopped');
                        (svgElement as HTMLElement).style.animation = '';
                    }
                    return {};
                },
            },
        };
        super(parameters);
        this.creatingField = '';
        this.creatingFieldColor = '#000000';
        this.updatingField = '';
        this.updatingFieldColor = '#000000';
        this.updatingCarId = '';
        this.currentPage = 1;
        this.maxPage = 1;
        this.timeValues = [{ string: 'string' }];
        this.configView();
    }

    configView(): void {
        let inputCreator;
        let inputParameters: ParametersInputCreator = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-block'],
            textContent: '',
            callback: {
                keyup: (event) => this.handler(event, 'creatingField'),
                change: (event) => this.handler(event, 'creatingField'),
                click: (event) => {
                    const targetElement = event.target;
                    if (targetElement instanceof HTMLButtonElement && this.creatingField) {
                        GarageView.createCar({ name: this.creatingField, color: this.creatingFieldColor });
                        this.raceBlock.deleteContent();
                        this.createGarageView(this.currentPage);
                    }
                },
            },
            buttonName: 'create',
        };
        inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
        inputParameters = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-block'],
            textContent: '',
            callback: {
                keyup: (event) => this.handler(event, 'updatingField'),
                change: (event) => this.handler(event, 'updatingField'),
                click: (event): void => {
                    const targetElement = event.target;
                    if (targetElement instanceof HTMLButtonElement) {
                        GarageView.updateCar(this.updatingCarId, this.updatingField, this.updatingFieldColor);
                        this.raceBlock.deleteContent();
                        this.createGarageView(this.currentPage);
                        const inputsArr = document.querySelectorAll('input');
                        inputsArr[2].value = '';
                        inputsArr[3].value = '#000000';
                    }
                },
            },
            buttonName: 'update',
        };
        inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
        const parametersRaceButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'RACE',
            callback: {
                click: async () => {
                    const roadContainerElementsArr = document.querySelectorAll('.block-garage__road-container');
                    const arrElementsId: string[] = [];
                    const svgElementsList = document.querySelectorAll(
                        '.block-garage__road-container > svg'
                    ) as unknown as HTMLElement[];
                    roadContainerElementsArr.forEach((el) => arrElementsId.push(el.id));
                    const arrPromisesStarted = arrElementsId.map(
                        (el) =>
                            new Promise((resolve, reject) => {
                                fetch(`${baseUrl}${path.engine}?id=${el}&status=started`, {
                                    method: 'PATCH',
                                })
                                    .then((response) => {
                                        return response.json();
                                    })
                                    .then((dataResp) => {
                                        return { data: dataResp, id: el };
                                    })
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                    );
                    Promise.all(arrPromisesStarted).then(async (values) => {
                        console.log(values);
                        const requestsResult = arrElementsId.map(async (el, i) => {
                            try {
                                const result: DataDriveResult = await GarageView.startEngine(el, 'drive');
                                result.time = (
                                    (values[i] as DataDriveResult).data.distance /
                                    (values[i] as DataDriveResult).data.velocity /
                                    1000
                                ).toFixed(2);
                                return result;
                            } catch (error) {
                                svgElementsList[i].style.animationPlayState = 'paused';
                                throw error;
                            }
                        });
                        svgElementsList.forEach((el, i) => {
                            const newEl = el;
                            newEl.style.animation = `moving ${
                                (values[i] as DataDriveResult).data.distance /
                                (values[i] as DataDriveResult).data.velocity /
                                1000
                            }s linear forwards`;
                        });
                        Promise.any(requestsResult)
                            .then((data) => {
                                const idWinner = data.id;
                                const winnerTime = data.time;
                                console.log(winnerTime);
                                const raceBlockById = document.getElementById(idWinner);
                                const parent = (raceBlockById as HTMLElement)?.closest('.block-garage');
                                const winnerName = (parent as unknown as HTMLElement).querySelector('span')
                                    ?.textContent;
                                const modalWindow = document.querySelector('.garage-block__modal-window');
                                modalWindow?.classList.remove('garage-block__modal-window_unvisible');
                                if (modalWindow && modalWindow instanceof HTMLElement) {
                                    modalWindow.textContent = `${winnerName} went first! Time: ${winnerTime}`;
                                }
                                return { idWinner, winnerTime };
                            })
                            .then((data) =>
                                GarageView.createWinner({
                                    id: data.idWinner,
                                    wins: +data.idWinner,
                                    time: +data.idWinner,
                                })
                            );
                    });
                },
            },
        };
        const raceButton = new ElementCreator(parametersRaceButton);
        this.elementCreator?.addInnerElement(raceButton.getCreatedElement());
        const parametersResetButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'RESET',
            callback: {
                click: () => {
                    const modalWindow = document.querySelector('.garage-block__modal-window');
                    modalWindow?.classList.add('garage-block__modal-window_unvisible');
                    const roadContainerElementsArr = document.querySelectorAll('.block-garage__road-container');
                    const arrElementsId: string[] = [];
                    const svgElementsList = document.querySelectorAll(
                        '.block-garage__road-container > svg'
                    ) as unknown as HTMLElement[];
                    roadContainerElementsArr.forEach((el) => arrElementsId.push(el.id));
                    arrElementsId.forEach(async (el, i) => {
                        svgElementsList[i].style.animation = '';
                        await GarageView.startEngine(el, 'stopped');
                    });
                },
            },
        };
        const resetButton = new ElementCreator(parametersResetButton);
        this.elementCreator?.addInnerElement(resetButton.getCreatedElement());
        const parametersGenerateCarsButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'GENERATE CARS',
            callback: {
                click: () => {
                    for (let i = 0; i < 100; i += 1) {
                        const modelCar = GarageView.getRandomNameCar(carBrands, carModels);
                        const colorCar = GarageView.getRandomColor();
                        GarageView.createCar(GarageView.createBody(modelCar, colorCar));
                    }
                    this.raceBlock.deleteContent();
                    this.createGarageView(this.currentPage);
                },
            },
        };
        const generateCarsButton = new ElementCreator(parametersGenerateCarsButton);
        this.elementCreator?.addInnerElement(generateCarsButton.getCreatedElement());
        this.createGarageView(this.currentPage);
        const parametersModalWindow: ParametersElementCreator = {
            tag: 'div',
            tagClasses: ['garage-block__modal-window', 'garage-block__modal-window_unvisible'],
            textContent: '',
            callback: null,
        };
        const modalWindow = new ElementCreator(parametersModalWindow);
        this.elementCreator?.addInnerElement(modalWindow.getCreatedElement());
        const parametersButtonPrev: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__pagination-prev'],
            textContent: 'Prev Page',
            callback: {
                click: () => {
                    if (this.currentPage !== 1) {
                        this.currentPage -= 1;
                        this.raceBlock.deleteContent();
                        this.createGarageView(this.currentPage);
                    }
                },
            },
        };
        const buttonPrev = new ElementCreator(parametersButtonPrev);
        this.elementCreator?.addInnerElement(buttonPrev.getCreatedElement());
        const parametersButtonNext: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__pagination-next'],
            textContent: 'Next Page',
            callback: {
                click: () => {
                    if (this.currentPage !== this.maxPage) {
                        this.currentPage += 1;
                        this.raceBlock.deleteContent();
                        this.createGarageView(this.currentPage);
                    }
                },
            },
        };
        const buttonNext = new ElementCreator(parametersButtonNext);
        this.elementCreator?.addInnerElement(buttonNext.getCreatedElement());
    }

    handler(event: Event, inputField: string): void {
        if (event.target instanceof HTMLInputElement && !event.target.hasAttribute('type')) {
            this[inputField] = event.target.value;
        }
        if (event.target instanceof HTMLInputElement && event.target.hasAttribute('type')) {
            this[`${inputField}Color`] = event.target.value;
        }
        if (event.target instanceof HTMLButtonElement) {
            this[`${inputField}Color`] = event.target.value;
        }
    }

    static async getCars(currentPage: number): Promise<object> {
        const response = await fetch(`${baseUrl}${path.garage}?_page=${currentPage}&_limit=7`);
        const data = await response.json();
        const countCars = Number(await response.headers.get('X-Total-Count'));
        const maxPage = Math.ceil(countCars / 7);
        return { data, countCars, maxPage };
    }

    async createGarageView(currentPage: number) {
        const parametersRaceBlock = (await GarageView.getCars(this.currentPage)) as GarageViewData;
        const data = await parametersRaceBlock.data;
        const countCars = await parametersRaceBlock.countCars;
        const maxPage = await parametersRaceBlock.maxPage;
        let raceBlock;
        if (countCars) {
            raceBlock = new RaceBlockView(data, countCars, currentPage);
            this.raceBlock = raceBlock;
            this.maxPage = maxPage;
        }
        this.elementCreator?.addInnerElement(await raceBlock.getElementCreator());
    }

    static async createCar(body: { name: string; color: string }): Promise<void> {
        const response = await fetch(`${baseUrl}${path.garage}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const car = await response.json();
        return car;
    }

    static async updateCar(id: string, name: string, color: string) {
        const response = await fetch(`${baseUrl}${path.garage}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: `${name}`, color: `${color}` }),
        });
        const car = await response.json();
        return car;
    }

    static async deleteCar(id) {
        const response = await fetch(`${baseUrl}${path.garage}/${id}`, {
            method: 'DELETE',
        });
        const carDeleted = await response.json();
        return carDeleted;
    }

    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i += 1) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getRandomNameCar(arr1, arr2) {
        let nameCar = '';
        nameCar += arr1[Math.floor(Math.random() * 10)];
        nameCar += arr2[Math.floor(Math.random() * 10)];
        return nameCar;
    }

    static createBody(modelCar, colorCar) {
        return { name: modelCar, color: colorCar };
    }

    static async startEngine(id, status) {
        const response = await fetch(`${baseUrl}${path.engine}?id=${id}&status=${status}`, {
            method: 'PATCH',
        });
        const data = await response.json();
        return { data, id };
    }

    static async createWinner(body: { id: string; wins: number; time: number }): Promise<void> {
        const response = await fetch(`${baseUrl}${path.winners}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const winner = await response.json();
        return winner;
    }
}
