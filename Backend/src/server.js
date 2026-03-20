const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const app = require("./app");

const connectDB = require("./db/db");

(async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
})();
