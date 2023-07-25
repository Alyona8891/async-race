import { baseUrl, carBrands, carModels, path } from '../../../../../data/data';
import {
    DataDriveResult,
    GarageViewData,
    ParametersElementCreator,
    ParametersInputCreator,
    WinnerData,
} from '../../../../../types/types';
import clearInputValue from '../../../../functions/clearInputValue';
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

    modalWindow!: HTMLElement;

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
                        GarageView.deleteWinner(garageBlockId);
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
                        const parentDiv = inputsArr[2].closest('div');
                        const updateButton = parentDiv?.querySelector('button');
                        if (updateButton) {
                            updateButton.disabled = false;
                        }
                        inputsArr[2].disabled = false;
                        inputsArr[2].value = nameCar;
                        this.updatingField = nameCar;
                        inputsArr[3].value = svgElementFill;
                        inputsArr[3].disabled = false;
                        this.updatingFieldColor = svgElementFill;
                        this.updatingCarId = garageBlockId;
                    }
                    if ((target as HTMLElement).classList.contains('block-garage__button_moving')) {
                        (target as HTMLElement).setAttribute('disabled', '');
                        const parent = (target as HTMLElement).closest('.block-garage');
                        let garageBlockId;
                        let svgElement;
                        let roadLength;
                        if (parent) {
                            garageBlockId = parent.querySelector('.block-garage__road-container')?.id;
                            const garageBlock = parent.querySelector('.block-garage__road-container');
                            svgElement = garageBlock?.querySelector('svg');
                            roadLength = (garageBlock as HTMLElement).offsetWidth - 60;
                        }
                        const parametersMoving = await GarageView.startEngine(garageBlockId, 'started');
                        const time = (await parametersMoving.data.distance) / (await parametersMoving.data.velocity);
                        const oneStep = roadLength / (time / 10);
                        let startPosition = 0;
                        const carAnimation = setInterval(() => {
                            if (startPosition < roadLength) {
                                startPosition += oneStep;
                                (svgElement as HTMLElement).style.left = `${startPosition}px`;
                            }
                        }, 10);
                        try {
                            await GarageView.startEngine(garageBlockId, 'drive');
                        } catch {
                            clearInterval(carAnimation);
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
        // this.timeValues = [{ string: 'string' }];
        this.configView();
    }

    configView(): void {
        let inputCreator;
        let inputParameters: ParametersInputCreator = {
            tag: 'div',
            tagClasses: ['garage-block__input-block', 'input-create'],
            textContent: '',
            callback: {
                keyup: (event) => this.handler(event, 'creatingField'),
                change: (event) => this.handler(event, 'creatingField'),
                click: async (event) => {
                    const targetElement = event.target as HTMLElement;
                    if (targetElement instanceof HTMLButtonElement && this.creatingField) {
                        clearInputValue(targetElement);
                        await GarageView.createCar({ name: this.creatingField, color: this.creatingFieldColor });
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
            tagClasses: ['garage-block__input-block', 'input-update'],
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
        inputCreator = new InputCreator(inputParameters);
        this.elementCreator?.addInnerElement(inputCreator.getCreatedElement());
        inputCreator
            .getCreatedElement()
            .querySelectorAll('input')
            .forEach((el: HTMLInputElement) => {
                const newEl: HTMLInputElement = el;
                newEl.disabled = true;
            });
        inputCreator.getCreatedElement().querySelector('button').disabled = true;
        const parametersRaceButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'RACE',
            callback: {
                click: async () => {
                    const roadContainerElementsArr = document.querySelectorAll('.block-garage__road-container');
                    const roadLength = (roadContainerElementsArr[0] as HTMLElement).offsetWidth - 60;
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
                        const requestsResult = arrElementsId.map(async (el, i) => {
                            let startPosition = 0;
                            const newEl = svgElementsList[i];
                            const timeEl =
                                (values[i] as DataDriveResult).data.distance /
                                (values[i] as DataDriveResult).data.velocity;
                            const carAnimation = setInterval(() => {
                                const oneStep = roadLength / (timeEl / 10);
                                if (startPosition < roadLength) {
                                    startPosition += oneStep;
                                    (newEl as HTMLElement).style.left = `${startPosition}px`;
                                }
                            }, 10);
                            try {
                                const result: DataDriveResult = await GarageView.startEngine(el, 'drive');
                                result.time = (
                                    (values[i] as DataDriveResult).data.distance /
                                    (values[i] as DataDriveResult).data.velocity /
                                    1000
                                ).toFixed(2);
                                return result;
                            } catch (error) {
                                clearInterval(carAnimation);
                                throw error;
                            }
                        });
                        Promise.any(requestsResult)
                            .then((data) => {
                                const idWinner = data.id;
                                const winnerTime = data.time;

                                return { idWinner: +idWinner, winnerTime };
                            })
                            .then((data) => {
                                if (data.winnerTime) {
                                    const raceBlockById = document.getElementById(data.idWinner.toString());
                                    const parent = (raceBlockById as HTMLElement)?.closest('.block-garage');
                                    const winnerName = (parent as unknown as HTMLElement).querySelector('span')
                                        ?.textContent;
                                    if (this.modalWindow && this.modalWindow instanceof HTMLElement) {
                                        this.modalWindow.classList.remove('garage-block__modal-window_unvisible');
                                        this.modalWindow.textContent = `${winnerName} went first! Time: ${data.winnerTime}`;
                                    }
                                    GarageView.checkWinner(data.idWinner, +data.idWinner, +data.winnerTime);
                                }
                            });
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
                    const roadContainerElementsArr = document.querySelectorAll('.block-garage__road-container');
                    const arrElementsId: string[] = [];
                    const svgElementsList = document.querySelectorAll(
                        '.block-garage__road-container > svg'
                    ) as unknown as HTMLElement[];
                    roadContainerElementsArr.forEach((el) => arrElementsId.push(el.id));
                    const requests = arrElementsId.map(
                        (el) =>
                            new Promise((resolve, reject) => {
                                fetch(`${baseUrl}${path.engine}?id=${el}&status=stopped`, {
                                    method: 'PATCH',
                                })
                                    .then((response) => {
                                        return response.json();
                                    })
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                    );
                    Promise.all(requests).then(() => {
                        this.modalWindow.classList.remove('garage-block__modal-window_unvisible');
                        svgElementsList.forEach(async (el) => {
                            const newEl = el;
                            for (let i = 1; i < 99999; i += 1) {
                                clearInterval(i);
                            }
                            newEl.style.left = '0px';
                        });
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
        this.modalWindow = modalWindow.getCreatedElement() as HTMLElement;
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
        try {
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
        } catch (error) {
            console.log(error);
        }
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

    static async createWinner(body: { id: number; wins: number; time: number }): Promise<void> {
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

    static createBodyWinner(idWin: number, winsWin: number, timeWin: number) {
        return { id: idWin, wins: winsWin, time: timeWin };
    }

    static async getWinner(id: number): Promise<WinnerData> {
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

    static async updateWinner(id: number, wins: number, time: number): Promise<void> {
        const response = await fetch(`${baseUrl}${path.winners}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ wins: `${wins}`, time: `${time}` }),
        });
        const updateWinner = await response.json();
        return updateWinner;
    }

    static async checkWinner(idWin: number, winsWin: number, timeWin: number) {
        try {
            const winner = await GarageView.getWinner(idWin);
            if (!winner.id) {
                await GarageView.createWinner(GarageView.createBodyWinner(idWin, 1, timeWin));
            } else {
                const winnerLastWins = await winner.wins;
                const winnerNewWins = +winnerLastWins + 1;
                const winnerLastBestTime = await winner.time;
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
}
