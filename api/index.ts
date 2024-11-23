import app from "../src/app";
import connectDB from "../src/config/db";

// Set the environment variable PORT to 3000 if it is not already set.
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the application.
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  connectDB();
});

export default app;
