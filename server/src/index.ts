import { env } from "./config/env.js";
import { createApp } from "./app.js";

console.log("Booting StitchBear API...");

const app = createApp();

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`StitchBear API listening on http://0.0.0.0:${env.PORT}`);
});
