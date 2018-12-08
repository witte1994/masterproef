const mongoose = require('mongoose');

const HistoryController = require('./history');
const Workflow = require('../../models/modules/workflow');
const WorkflowSubstep = require('../../models/modules/workflowsubstep');

exports.importValues = function (pId, workflows) {
   
    for (var i = 0; i < workflows.length; i++) {
        console.log(workflows[i]);
        importWorkflow(pId, workflows[i]);
    }

    var info = {
        patient: pId,
        clinician: null,
        srcElement: "workflow",
        operation: "import",
        description: workflows.length + " workflows"
    };
    HistoryController.add_to_history(info);
}

async function importWorkflow(pId, workflow) {
    var steps = [];

    for (var i = 0; i < workflow.steps.length; i++) {
        var stepObj = await getStepObject(workflow.steps[i]);
        steps.push(stepObj);
    }

    const newWorkflow = new Workflow({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        clinician: null,
        name: workflow.name,
        description: workflow.description,
        steps: steps
    });
    newWorkflow
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
        });
}

async function getStepObject(step) {
    var stepObj = {
        _id: mongoose.Types.ObjectId(),
        name: step.name,
        description: step.description,
        substeps: []
    }

    for (var i = 0; i < step.substeps.length; i++) {
        var substepId = await importSubstep(step.substeps[i]);
        stepObj.substeps.push(substepId);
    }

    return stepObj;
}

async function importSubstep(substep) {
    const workflowSubstep = new WorkflowSubstep({
        _id: mongoose.Types.ObjectId(),
        description: substep.description,
    });
    const result = await workflowSubstep.save();

    console.log("imported substep");
    return result._id;
}

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
        .populate("steps.substeps")
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
        .populate("steps.substeps")
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
        .populate("steps.substeps")
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
        .populate("steps.substeps")
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
        .populate("steps.substeps")
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

exports.create_substep = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var workflowId = req.params.id;
    var stepId = req.params.stepId;

    const workflowSubstep = new WorkflowSubstep({
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
    });
    workflowSubstep
        .save()
        .then(result => {
            Workflow.findOneAndUpdate({ "_id": workflowId, "steps._id": stepId },
                {
                    $push: { "steps.$.substeps": workflowSubstep._id }
                },
                { new: true })
                .populate("steps.substeps")
                .exec()
                .then(doc => {
                    var info = {
                        patient: pId,
                        clinician: cId,
                        srcElement: "workflow",
                        operation: "create",
                        description: "Substep: " + workflowSubstep.description
                    }
                    HistoryController.add_to_history(info);

                    console.log(doc);
                    res.status(200).json(doc);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.update_substep = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var workflowId = req.params.id;
    var stepId = req.params.stepId;
    var substepId = req.body.id;

    var substep = {
        description: req.body.description
    };

    WorkflowSubstep.findOneAndUpdate({ "_id": substepId },
        {
            description: substep.description
        },
        {
            new: true
        })
        .exec()
        .then(doc => {
            Workflow.findById(workflowId)
                .populate("steps.substeps")
                .exec()
                .then(doc => {
                    var info = {
                        patient: pId,
                        clinician: cId,
                        srcElement: "workflow",
                        operation: "update",
                        description: "Substep: " + substep.description
                    }
                    HistoryController.add_to_history(info);

                    console.log(doc);
                    res.status(200).json(doc);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete_substep = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var workflowId = req.params.id;
    var stepId = req.params.stepId;
    var substepId = req.params.substepId;

    WorkflowSubstep.deleteMany({ _id: substepId }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            Workflow.findOneAndUpdate({ "_id": workflowId, "steps._id": stepId },
                {
                    $pull: { "steps.$.substeps": substepId }
                },
                { new: true })
                .populate("steps.substeps")
                .exec()
                .then(doc => {
                    var info = {
                        patient: pId,
                        clinician: cId,
                        srcElement: "workflow",
                        operation: "delete",
                        description: "Workflow substep removed"
                    }
                    HistoryController.add_to_history(info);
        
                    console.log(doc);
                    res.status(200).json(doc);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }
    });
};