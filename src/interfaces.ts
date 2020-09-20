export interface Device {
    _id: string,
    name: string,
}

export interface Model {
    _id: string,
    name: string,
    content: string,
    device_id: string,
}

export interface State {
    _id: string,
    device_id: string,
    model_id: string,
    content: string,
}

export interface Config {
    server?: string,
    name: string
}