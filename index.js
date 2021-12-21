const express = require("express");
const { conectarDB } = require("./config/db");
const cors = require("cors");
const { renovationToken } = require("./controllers/refresh");
const { validarJWT } = require("./middlewares/validarJWT");
const app = express();
conectarDB();
//habilitamos el cors
app.use(cors());
//habilitamos json
app.use(express.json({ extended: true }));
//routes
app.get("/api/refresh", validarJWT, renovationToken);
app.use("/api/users", require("./routes/users"));
app.use("/api/empleados", require("./routes/empleado"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/cita", require("./routes/cita"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("el servidor esta funcionando en el puerto: " + PORT);
});
