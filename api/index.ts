import app from "../src/app";

// Set the environment variable PORT to 3000 if it is not already set.
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the application.
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;
