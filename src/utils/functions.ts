import { ERRORS, ERROR_CODES } from "./constants";

export const apiError = (code: ERROR_CODES): {
  errorCode: number;
  errorMessage: string;
} => {
  return ERRORS[code];
}