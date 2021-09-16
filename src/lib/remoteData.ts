export enum RemoteDataC {
	NotAsked = 'NotAsked',
	Loading = 'Loading',
	Failure = 'Failure',
	Success = 'Success',
}
export type NotAsked = { type: RemoteDataC.NotAsked };
export const notAsked: NotAsked = { type: RemoteDataC.NotAsked };
export type Loading = { type: RemoteDataC.Loading };
export const loading: Loading = { type: RemoteDataC.Loading };
export type Failure<Error> = { type: RemoteDataC.Failure; error: Error };
export const failure = <Error>(error: Error): Failure<Error> => ({
	type: RemoteDataC.Failure,
	error,
});
export type Success<Data> = { type: RemoteDataC.Success; data: Data };
export const success = <Data>(data: Data): Success<Data> => ({
	type: RemoteDataC.Success,
	data,
});
export type RemoteData<Data, Err> = NotAsked | Loading | Failure<Err> | Success<Data>;

export const isNotAsked = (rd: RemoteData<unknown, unknown>): rd is NotAsked =>
	rd.type === RemoteDataC.NotAsked;

export const isLoading = (rd: RemoteData<unknown, unknown>): rd is Loading =>
	rd.type === RemoteDataC.Loading;

export const isFailure = <Err>(rd: RemoteData<unknown, Err>): rd is Failure<Err> =>
	rd.type === RemoteDataC.Failure;

export const isSuccess = <Data>(rd: RemoteData<Data, unknown>): rd is Success<Data> =>
	rd.type === RemoteDataC.Success;

export const getError = <Err>(rd: RemoteData<unknown, Err>): Err | null => {
	if (rd.type === RemoteDataC.Failure) {
		return rd.error;
	}
	return null;
};

export const getData = <Data>(rd: RemoteData<Data, unknown>): Data | null => {
	if (rd.type === RemoteDataC.Success) {
		return rd.data;
	}
	return null;
};
