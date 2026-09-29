import { CalculatorError } from "../utils/parser.js";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Invalid expression" });
  }
  if (error instanceof CalculatorError) {
    return response.status(error.statusCode).json({ error: error.message });
  }
  if (error.statusCode === 503) {
    return response.status(503).json({ error: error.message });
  }

  console.error(error);
  return response.status(500).json({ error: "The calculator could not complete the request" });
}
