import { AxiosError } from "axios";
import { GenericErrorResponse } from "@/types/common.types";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as GenericErrorResponse | undefined;
    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function getErrorInfo(error: unknown): Record<string, unknown> {
  if (error instanceof AxiosError) {
    const data = error.response?.data as GenericErrorResponse | undefined;
    if (data?.errorInfo) return data.errorInfo;
  }
  return {};
}

export const AppError = class extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
};
