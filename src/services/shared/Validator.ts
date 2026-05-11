import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
  constructor(field: string) {
    super(`Missing field: ${field}`);
    this.name = "MissingFieldError";
  }
}

export class JSONValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JSONValidationError";
  }
}

export function validateAsSpaceEntry(arg: any) {
  if ((arg as SpaceEntry).location === undefined) {
    throw new MissingFieldError("location");
  }
  if ((arg as SpaceEntry).name === undefined) {
    throw new MissingFieldError("name");
  }
  if ((arg as SpaceEntry).id === undefined) {
    throw new MissingFieldError("id");
  }
}
