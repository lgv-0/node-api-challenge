const express = require("express");
const Projects = express();
const ProjectDB = require("../data/helpers/projectModel");

Projects.get("/", (req, res)=>
{
    res.status(200).send("Working.");
});

Projects.get("/:id", verifyID, (req, res)=>
{
    res.status(200).json(req.projectData);
});

Projects.get("/:id/actions", verifyID, (req, res)=>
{
    res.status(200).json(req.projectData.actions);
});

Projects.post("/", (req, res)=>
{
    if (req.body.name === undefined ||
        req.body.description === undefined ||
        req.body.completed === undefined)
    {
        res.status(300).send("Invalid request paramaters");
        return;
    }

    ProjectDB.insert(req.body).then((response)=>
    {
        res.status(201).json(response);
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error, check your body!");
    });
});

Projects.delete("/:id", verifyID, (req, res)=>
{
    ProjectDB.remove(req.projectData.id).then((response)=>
    {
        res.status(200).json(req.projectData);
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error");
    });
});

Projects.put("/:id", verifyID, (req, res)=>
{
    if (req.body.name === undefined &&
        req.body.description === undefined &&
        req.body.completed === undefined)
    {
        res.status(300).send("No data to update");
        return;
    }

    let ClassNames = Object.keys(req.body);
    for (let i = 0; i < ClassNames.length; i++)
        if (req.projectData[ClassNames[i]] === undefined ||
            typeof(req.projectData[ClassNames[i]]) !== typeof(req.body[ClassNames[i]]))
            {
                res.status(300).send("Invalid body detected");
                return;
            }

    ProjectDB.update(req.projectData.id, req.body).then((response)=>
    {
        res.status(200).json(response);
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error");
    });
});

function verifyID(req, res, next)
{
    if (req.params.id === undefined || isNaN(req.params.id))
    {
        res.status(300).send("Invalid request paramaters");
        return;
    }

    ProjectDB.get(req.params.id).then((response)=>
    {
        if (response !== null)
        {
            req.projectData = response;
            next();
        }
        else
            res.status(404).send("This ID doesn't exist.");
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error");
    });
}

module.exports = Projects;