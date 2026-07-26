import axios from "axios";
import { GenericErrorResponse } from "@/types/common.types";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as GenericErrorResponse | undefined;

    const issues = (data?.errorInfo as any)?.issues;
    if (Array.isArray(issues) && issues.length > 0) {
      const first = issues[0];
      if (first?.message) {
        return first.field ? `${first.field}: ${first.message}` : first.message;
      }
    }

    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function getErrorStatusCode(error: unknown): number | null {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }
  return null;
}

export function getErrorInfo(error: unknown): Record<string, unknown> {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as GenericErrorResponse | undefined;
    if (data?.errorInfo) return data.errorInfo;
  }
  return {};
}