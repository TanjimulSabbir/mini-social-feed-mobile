import axios from "axios";
import { GenericErrorResponse } from "@/types/common.types";
import { useErrorStore } from "@/store/error.store";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as GenericErrorResponse | undefined;
    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function getErrorInfo(error: unknown): Record<string, unknown> {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as GenericErrorResponse | undefined;
    if (data?.errorInfo) return data.errorInfo;
  }
  return {};
}

export function showBackendError(error: unknown, title?: string) {
  const message = getErrorMessage(error);
  const info = getErrorInfo(error);
  useErrorStore.getState().showError(message, info, title);
}

export const AppError = class extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
};