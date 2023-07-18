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
