const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = require("./src/app");

const connectDB = require("./src/db/db");

(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    console.log("Starting server without database connection");
  }

  const usingImageKit =
    Boolean(process.env.IMAGEKIT_PUBLIC_KEY) &&
    Boolean(process.env.IMAGEKIT_PRIVATE_KEY) &&
    Boolean(process.env.IMAGEKIT_URL_ENDPOINT);
  console.log(
    `Image hosting: ${usingImageKit ? 'ImageKit' : 'local uploads (set IMAGEKIT_* env vars to enable ImageKit)'}`
  );

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
})();