export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

export function isErrorWithStatus(error: unknown): error is { status: number } {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    typeof (error as any).status === "number"
  );
}

export function isErrorWithData(error: unknown): error is { data: any } {
  return (
    typeof error === "object" &&
    error != null &&
    "data" in error &&
    typeof (error as any).data === "object"
  );
}
