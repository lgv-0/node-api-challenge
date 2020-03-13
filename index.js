const express = require("express");
const server = express();

server.use(express.json());

const ProjectRoute = require("./routes/projects");
server.use("/projects", ProjectRoute);

server.get("/", (req, res)=>
{
    res.status(200).send("I'm alive.");
})

server.listen(5000);