import "dotenv/config";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const [{ default: app }, { default: connectDb }] = await Promise.all([
      import("./app.js"),
      import("./config/db.js")
    ]);

    await connectDb();

    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

startServer();
