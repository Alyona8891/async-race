export interface ParametersElementCreator {
    tag: string;
    tagClasses: string[] | null;
    textContent: string;
    callback: null;
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
