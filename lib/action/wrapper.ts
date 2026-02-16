import { isAxiosError } from "axios";
import { DEFAULT_ERROR_MESSAGE, getStatusMessage } from "../constants/message";

export type ActionResult<T> = {
  data?: T;
  error?: string;
  success: boolean;
  status?: number;
};

type ResponseWithStatus = {
  status: number;
};

type ResolveResultOptions<
  TResponse extends ResponseWithStatus,
  TSuccess extends TResponse,
  TData,
> = {
  isSuccess: (response: TResponse) => response is TSuccess;
  mapSuccess: (response: TSuccess) => Promise<TData> | TData;
  errorStatus?: (response: TResponse) => number;
  errorMessage?: (response: TResponse) => string | undefined;
};

export const actionSuccess = <T>(data: T, status?: number): ActionResult<T> => ({
  success: true,
  data,
  status,
});

export const actionError = (
  status?: number,
  error?: string,
): ActionResult<never> => ({
  success: false,
  status,
  error: getStatusMessage(status) || error || DEFAULT_ERROR_MESSAGE,
});

export const resolveActionResult = async <
  TResponse extends ResponseWithStatus,
  TSuccess extends TResponse,
  TData,
>(
  result: ActionResult<TResponse>,
  options: ResolveResultOptions<TResponse, TSuccess, TData>,
): Promise<ActionResult<TData>> => {
  if (!result.success || !result.data) {
    return actionError(result.status ?? 500, result.error);
  }

  const response = result.data;
  if (!options.isSuccess(response)) {
    const status = options.errorStatus?.(response) ?? response.status;
    return actionError(status, options.errorMessage?.(response));
  }

  try {
    const data = await options.mapSuccess(response);
    return actionSuccess(data, response.status);
  } catch (error) {
    return actionError(
      500,
      error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
    );
  }
};

export async function actionHandler<T>(
  promise: Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await promise;
    const status =
      typeof (data as { status?: unknown })?.status === "number"
        ? (data as { status: number }).status
        : undefined;

    return { data, success: true, status };
  } catch (error: unknown) {
    let message = DEFAULT_ERROR_MESSAGE;
    let status: number | undefined;

    if (isAxiosError(error)) {
      status = error.response?.status;
      message = getStatusMessage(status) || DEFAULT_ERROR_MESSAGE;
    } else if (error instanceof Error) {
      message = DEFAULT_ERROR_MESSAGE;
    }

    return actionError(status, message);
  }
}
