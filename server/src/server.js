import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 5000;

connectDatabase(process.env.MONGODB_URI);
app.listen(port, () => {
  console.log(`Calculator API listening on http://localhost:${port}`);
});
