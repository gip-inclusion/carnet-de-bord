export type portOut<T> = { subscribe: (f: (t: T) => void) => void };
export type portIn<T> = { send: (t: T) => void };
