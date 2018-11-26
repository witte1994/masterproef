const mongoose = require('mongoose');

const HistoryController = require('./history');
const Workflow = require('../../models/modules/workflow');

exports.get_all = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;

    Workflow.find({ 
            $and: 
            [
                { $or: 
                    [
                        { patient: pId },
                        { patient: null}
                    ] },
                { $or: 
                    [
                        { clinician: cId},
                        { clinician: null}
                    ]}
            ]
        })
        .select('_id name')
        .lean()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.get_by_id = (req, res, next) => {
    Workflow.findById(req.params.id)
        .lean()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.create = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;

    const workflow = new Workflow({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        clinician: cId,
        name: req.body.name,
        description: req.body.description,
        steps: []
    });
    workflow
        .save()
        .then(result => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "workflow",
                operation: "create",
                description: workflow.name + ": " + workflow.description
            }
            HistoryController.add_to_history(info);

            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.update = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;

    Workflow.findOneAndUpdate({ _id: req.body.id },
            {
                patient: pId,
                clinician: cId,
                name: req.body.name,
                description: req.body.description
            },
            { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "workflow",
                operation: "update",
                description: req.body.name + ": " + req.body.description
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;

    Workflow.deleteMany({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "workflow",
                operation: "delete",
                description: "Workflow entry removed"
            };
            HistoryController.add_to_history(info);

            res.status(200).json({
                message: "DELETE ok"
            });
        }
    });
};

exports.create_step = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var workflowId = req.params.id;

    var step = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        substeps: []
    };

    Workflow.findOneAndUpdate({ _id: workflowId },
        {
            $push: { steps: step }
        },
        { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "workflow",
                operation: "create",
                description: step.name + ": " + step.description
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.update_step = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var workflowId = req.params.id;

    var step = {
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description
    };

    Workflow.findOneAndUpdate({ "_id": workflowId, "steps._id": step._id  },
        {
            $set: { "steps.$.name": step.name,
                    "steps.$.description": step.description }
        },
        { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "workflow",
                operation: "update",
                description: step.name + ": " + step.description
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete_step = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var workflowId = req.params.id;
    var stepId = req.params.stepId;

    Workflow.findOneAndUpdate({ _id: workflowId },
        {
            $pull: { steps: { _id: stepId } }
        },
        { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "workflow",
                operation: "delete",
                description: "Workflow step removed"
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};