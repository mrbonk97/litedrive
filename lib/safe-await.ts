type SuccessResult<T> = readonly [T, null];
type ErrorResult<E> = readonly [null, E];
type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function safeAwait<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
