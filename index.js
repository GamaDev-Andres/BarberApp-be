const express = require("express");
const { conectarDB } = require("./config/db");
const app = express();
conectarDB();

//habilitamos json
app.use(express.json({ extended: true }));
//routes

app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("el servidor esta funcionando en el puerto: " + PORT);
});
