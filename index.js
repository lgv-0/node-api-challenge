const express = require("express");
const cors = require("cors");
const server = express();

server.use(express.json());
server.use(cors());

server.use("/projects", require("./routes/projects"));
server.use("/actions", require("./routes/actions"));

server.get("/", (req, res)=>
{
    res.status(200).send("I'm alive.");
})

server.listen(5000);