const express = require("express");
const Actions = express();
const ActionDB = require("../data/helpers/actionModel");

Actions.get("/", (req, res)=>
{
    res.status(200).send(".workinG");
});

Actions.get("/:id", verifyID, (req, res)=>
{
    res.status(200).json(req.actionData);
});

Actions.post("/", (req, res)=>
{
    if (req.body.project_id === undefined ||
        req.body.description === undefined ||
        req.body.notes === undefined ||
        req.body.completed === undefined)
    {
        res.status(300).send("Invalid request paramaters");
        return;
    }

    ActionDB.insert(req.body).then((response)=>
    {
        res.status(201).json(response);
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error, check your body!");
    });
});

Actions.put("/:id", verifyID, (req, res)=>
{
    if (req.body.project_id === undefined &&
        req.body.description === undefined &&
        req.body.notes === undefined &&
        req.body.completed === undefined)
    {
        res.status(300).send("No data to update");
        return;
    }

    let ClassNames = Object.keys(req.body);
    for (let i = 0; i < ClassNames.length; i++)
        if (req.actionData[ClassNames[i]] === undefined ||
            (typeof(req.actionData[ClassNames[i]]) !== typeof(req.body[ClassNames[i]]) &&
             (ClassNames[i] !== "completed" && ClassNames[i] !== "project_id")))
            {
                res.status(300).send("Invalid body detected");
                return;
            }
    
    ActionDB.update(req.actionData.id, req.body).then((response)=>
    {
        res.status(200).json(response);
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error");
    });
});

Actions.delete("/:id", verifyID, (req, res)=>
{
    ActionDB.remove(req.actionData.id).then((response)=>
    {
        res.status(200).json(req.actionData);
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

    ActionDB.get(req.params.id).then((response)=>
    {
        req.actionData = response;
        next();
    }).catch((error)=>
    {
        res.status(500).send("Internal Server Error");
    });
}

module.exports = Actions;