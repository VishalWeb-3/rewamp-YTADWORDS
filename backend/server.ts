import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`YouTube AdWords API running on port ${PORT}`);
});
