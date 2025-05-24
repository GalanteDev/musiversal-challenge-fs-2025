export function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any).response === "object"
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (error as any).response;
    if (response?.data?.message) return response.data.message;
    if (response?.data?.error) return response.data.error;
    if (response?.data?.errors) return response.data.errors.join(" ");
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
