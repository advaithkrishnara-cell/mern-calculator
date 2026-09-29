import { calculateExpression, getCalculationHistory } from "../services/calculatorService.js";

export async function calculate(request, response, next) {
  try {
    const calculation = await calculateExpression(request.body?.expression);
    response.json(calculation);
  } catch (error) {
    next(error);
  }
}

export async function history(_request, response, next) {
  try {
    const calculations = await getCalculationHistory();
    response.json(calculations);
  } catch (error) {
    next(error);
  }
}
