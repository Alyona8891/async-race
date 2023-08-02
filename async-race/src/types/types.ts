export interface ParametersElementCreator {
  tag: string;
  tagClasses: string[] | null;
  textContent: string;
  callback: null | CallbackObject;
  buttonName?: string;
}

export type CallbackObject = {
  [key: string]: (event: Event | KeyboardEvent) => void;
};

export type FunctionObject = {
  [key: string]: CallbackObject;
};

export interface PageParameter {
  name: string;
  callBack: null | CallbackObject;
}

export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface GarageData {
  data: Car[] | null;
  countCars: number;
  maxPage: number;
}

export type DataDrive = {
  distance: number;
  velocity: number;
};

export type Winner = {
  wins: number;
  time: number;
  id: number;
};

export interface DataDriveResult {
  data: DataDrive;
  id: number;
  time?: string;
}

export interface Winners {
  dataWinners: Winner[];
  countWinners: number;
  maxPage: number;
}

export interface ParametersResultBlock {
  colorWinner: string,
  nameWinner: string,
  winsWinner: number,
  timeWinner: number,
}

export interface MoveParameters {
  garageBlockId: string | undefined,
  svgElement: SVGSVGElement | undefined | null,
  roadLength: number,
}
