import { JSONValidationError } from "./Validator";

export const parseJson = (arg: string) => {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JSONValidationError((error as Error).message);
  }
};

export const idGenerator = () => {
  return crypto.randomUUID();
};
