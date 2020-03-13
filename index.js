const express = require("express");
const server = express();

server.use(express.json());

server.get("/", (req, res)=>
{
    res.status(200).send("I'm alive.");
})

server.listen(5000);