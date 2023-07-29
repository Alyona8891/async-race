export interface ParametersElementCreator {
  tag: string;
  tagClasses: string[] | null;
  textContent: string;
  callback: null | CallbackObject;
}
export interface ParametersInputCreator {
  tag: string;
  tagClasses: string[] | null;
  textContent: string;
  callback: null | CallbackObject;
  buttonName?: string;
}

export type CallbackObject = {
  [key: string]: (event: Event | KeyboardEvent) => void;
};

type FunctionType = {
  [key: string]: (event: Event | KeyboardEvent) => void;
};

export type FunctionObject = {
  [key: string]: FunctionType;
};

export interface PageParameter {
  name: string;
  callBack: null | CallbackObject;
}

export interface DataOneCar {
  name: string;
  color: string;
  id: number;
}

export interface DataGetCars {
  data: DataOneCar[];
  countCars: number;
  maxPage: number;
}

export interface DataUpdateCar {
  data: DataOneCar[];
  countCars: number;
  maxPage: number;
}

export type DataDrive = {
  distance: number;
  velocity: number;
};

export type WinnerData = {
  wins: number;
  time: number;
  id: number;
};

export interface DataDriveResult {
  data: DataDrive;
  id: number;
  time?: string;
}

export interface GarageViewData {
  data: DataOneCar[];
  countCars: number;
  maxPage: number;
}

export interface WinnersData {
  dataWinners: WinnerData[];
  countWinners: number;
  maxPage: number;
}

export interface BodyWinnerData {
  id: number;
  wins: number;
  time: number;
}

export type BodyRequest = {
  name: string;
  color: string;
};

export interface ParametersResultBlock {
  colorWinner: string,
  nameWinner: string,
  winsWinner: number,
  timeWinner: number,
}

export interface ParametersMoving {
  garageBlockId: string | undefined,
  svgElement: SVGSVGElement | undefined | null,
  roadLength: number,
}
