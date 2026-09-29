import mongoose from "mongoose";
import Calculation from "../models/Calculation.js";
import { CalculatorError, evaluateExpression } from "../utils/parser.js";

export async function calculateExpression(expression) {
  if (typeof expression !== "string" || !expression.trim()) {
    throw new CalculatorError();
  }

  const normalizedExpression = expression.trim();
  const result = evaluateExpression(normalizedExpression);

  if (mongoose.connection.readyState === 1) {
    try {
      await Calculation.create({ expression: normalizedExpression, result });
    } catch (error) {
      console.warn(`Calculation succeeded but history could not be saved. ${error.message}`);
    }
  }

  return { expression: normalizedExpression, result };
}

export async function getCalculationHistory() {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error("Calculation history is unavailable until MongoDB is connected.");
    error.statusCode = 503;
    throw error;
  }

  return Calculation.find().sort({ createdAt: -1 }).limit(20).lean();
}
