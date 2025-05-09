import { sendError } from "../sendError";

describe("sendError", () => {
  it("sends a formatted error response", () => {
    const mockStatus = jest.fn().mockReturnThis();
    const mockJson = jest.fn();
    const mockRes = { status: mockStatus, json: mockJson } as any;

    sendError(mockRes, 400, ["Something went wrong"]);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: "error",
      errors: ["Something went wrong"],
    });
  });
});
