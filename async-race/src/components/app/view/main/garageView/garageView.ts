import { baseUrl, carBrands, carModels, path } from '../../../../../data/data';
import { ParametersElementCreator, ParametersInputCreator } from '../../../../../types/types';
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
                        this.createGarageView();
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
                        const param = await GarageView.startEngine(garageBlockId);
                        const time = (await param.distance) / (await param.velocity) / 1000;
                        (svgElement as HTMLElement).style.animation = `moving ${await time}s linear forwards`;
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
        this.configView();
    }

    async configView() {
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
                        this.createGarageView();
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
                click: (event) => {
                    const targetElement = event.target;
                    if (targetElement instanceof HTMLButtonElement) {
                        GarageView.updateCar(this.updatingCarId, this.updatingField, this.updatingFieldColor);
                        this.raceBlock.deleteContent();
                        this.createGarageView();
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
            callback: null,
        };
        const raceButton = new ElementCreator(parametersRaceButton);
        this.elementCreator?.addInnerElement(raceButton.getCreatedElement());
        const parametersResetButton: ParametersElementCreator = {
            tag: 'button',
            tagClasses: ['garage-block__button'],
            textContent: 'RESET',
            callback: null,
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
                    this.createGarageView();
                },
            },
        };
        const generateCarsButton = new ElementCreator(parametersGenerateCarsButton);
        this.elementCreator?.addInnerElement(generateCarsButton.getCreatedElement());
        this.createGarageView();
    }

    handler(event: Event, inputField: string) {
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

    static async getCars(currentPage) {
        const response = await fetch(`${baseUrl}${path.garage}?_page=${currentPage}&_limit=7`);
        const data = await response.json();
        const countCars = Number(await response.headers.get('X-Total-Count'));
        return { data, countCars };
    }

    async createGarageView() {
        const parametersRaceBlock = await GarageView.getCars(this.currentPage);
        const data = await parametersRaceBlock.data;
        const countCars = await parametersRaceBlock.countCars;
        let raceBlock;
        if (countCars) {
            raceBlock = new RaceBlockView(data, countCars);
            this.raceBlock = raceBlock;
        }
        this.elementCreator?.addInnerElement(await raceBlock.getElementCreator());
    }

    static async createCar(body) {
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

    static async updateCar(id, name, color) {
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

    static async startEngine(id) {
        const response = await fetch(`${baseUrl}${path.engine}?id=${id}&status=started`, {
            method: 'PATCH',
        });
        const data = await response.json();
        return data;
    }
}
