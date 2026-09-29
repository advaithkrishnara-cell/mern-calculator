const apiUrl = import.meta.env.VITE_API_URL || "/api";

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The calculator request failed.");
  return data;
}

export async function requestCalculation(expression) {
  const response = await fetch(`${apiUrl}/calculator/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expression })
  });
  return readJson(response);
}

export async function requestHistory() {
  const response = await fetch(`${apiUrl}/calculator/history`);
  return readJson(response);
}
