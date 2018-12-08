const mongoose = require('mongoose');

const HistoryController = require('./history');
const Checklist = require('../../models/modules/checklist');
const ChecklistSubstep = require('../../models/modules/checklistsubstep');

exports.importValues = async function (pId, checklist) {
    var steps = [];

    for (var i = 0; i < checklist.steps.length; i++) {
        var stepObj = await getStepObject(checklist.steps[i]);
        steps.push(stepObj);
    }

    const newChecklist = new Checklist({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        description: checklist.description,
        steps: steps
    });
    newChecklist
        .save()
        .then(result => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "checklist",
                operation: "import",
                description: "checklist: " + checklist.description
            };
            HistoryController.add_to_history(info);
        })
        .catch(err => {
        });
}

async function getStepObject(step) {
    var stepObj = {
        _id: mongoose.Types.ObjectId(),
        checked: false,
        description: step.description,
        substeps: []
    };

    for (var i = 0; i < step.substeps.length; i++) {
        var substepId = await importSubstep(step.substeps[i]);
        stepObj.substeps.push(substepId);
    }

    return stepObj;
}

async function importSubstep(substep) {
    const checklistSubstep = new ChecklistSubstep({
        _id: mongoose.Types.ObjectId(),
        checked: false,
        description: substep.description,
    });
    const result = await checklistSubstep.save();

    return result._id;
}

exports.get_by_id = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    Checklist.findOne({ patient: pId })
        .populate("steps.substeps")
        .exec()
        .then(doc => {
            if (doc == null) {
                createChecklist(pId, res);
            } else {
                console.log(doc);
                res.status(200).json(doc);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

function createChecklist(pId, res) {
    const checklist = new Checklist({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        description: "Add a general description to this checklist",
        steps: []
    });
    checklist
        .save()
        .then(result => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "checklist",
                operation: "create",
                description: checklist.description
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
}

exports.update = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    
    Checklist.findOneAndUpdate({ _id: req.body.id },
            {
                description: req.body.description
            },
            { new: true })
        .populate("steps.substeps")
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "checklist",
                operation: "update",
                description: req.body.description
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

exports.reset_checklist = async (req, res, next) => {
    var checklistId = req.params.id;

    const query =  Checklist.findOne({ _id: checklistId })
        .populate("steps.substeps");

    const result = await query.exec();

    for (var i = 0; i < result.steps.length; i++) {
        await resetStep(result._id, result.steps[i]);
    }

    var resetResult = await query.exec();

    console.log(resetResult);
    res.status(200).json(resetResult);
};

async function resetStep(checklistId, step) {
    const query = Checklist.findOneAndUpdate({ "_id": checklistId, "steps._id": step._id  },
        {
            $set: { "steps.$.checked": false }
        },
        { new: true });

    const result = await query.exec();

    for (var i = 0; i < step.substeps.length; i++) {
        await resetSubstep(step.substeps[i]._id);
    }
}

async function resetSubstep(substepId) {
    const query = ChecklistSubstep.findOneAndUpdate({ "_id": substepId },
        {
            checked: false
        },
        {
            new: true
        });

    const result = await query.exec();

    return;
}

exports.create_step = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    var checklistId = req.params.id;

    var step = {
        _id: mongoose.Types.ObjectId(),
        checked: false,
        description: req.body.description,
        substeps: []
    };

    Checklist.findOneAndUpdate({ _id: checklistId },
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
                srcElement: "checklist",
                operation: "create",
                description: "Step: " + step.description
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

exports.check_step = (req, res, next) => {
    var checklistId = req.params.id;

    var step = {
        _id: req.body.id,
        checked: req.body.checked,
    };

    Checklist.findOneAndUpdate({ "_id": checklistId, "steps._id": step._id  },
        {
            $set: { "steps.$.checked": step.checked }
        },
        { new: true })
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

exports.update_step = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    var checklistId = req.params.id;

    var step = {
        _id: req.body.id,
        description: req.body.description
    };

    Checklist.findOneAndUpdate({ "_id": checklistId, "steps._id": step._id  },
        {
            $set: { "steps.$.description": step.description }
        },
        { new: true })
        .populate("steps.substeps")
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: cId,
                srcElement: "checklist",
                operation: "update",
                description: "Step: " + step.description
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
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    var checklistId = req.params.id;
    var stepId = req.params.stepId;

    Checklist.findOneAndUpdate({ _id: checklistId },
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
                srcElement: "checklist",
                operation: "delete",
                description: "Step removed"
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
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    var checklistId = req.params.id;
    var stepId = req.params.stepId;

    const checklistSubstep = new ChecklistSubstep({
        _id: mongoose.Types.ObjectId(),
        checked: false,
        description: req.body.description,
    });
    checklistSubstep
        .save()
        .then(result => {
            Checklist.findOneAndUpdate({ "_id": checklistId, "steps._id": stepId },
                {
                    $push: { "steps.$.substeps": checklistSubstep._id }
                },
                { new: true })
                .populate("steps.substeps")
                .exec()
                .then(doc => {
                    var info = {
                        patient: pId,
                        clinician: cId,
                        srcElement: "checklist",
                        operation: "create",
                        description: "Substep: " + checklistSubstep.description
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

exports.check_substep = (req, res, next) => {
    var checklistId = req.params.id;
    var substepId = req.params.substepId;

    var substep = {
        checked: req.body.checked
    };

    ChecklistSubstep.findOneAndUpdate({ "_id": substepId },
        {
            checked: substep.checked
        },
        {
            new: true
        })
        .exec()
        .then(doc => {
            Checklist.findById(checklistId)
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
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.update_substep = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    var checklistId = req.params.id;
    var substepId = req.params.substepId;

    var substep = {
        description: req.body.description
    };

    ChecklistSubstep.findOneAndUpdate({ "_id": substepId },
        {
            checked: substep.checked,
            description: substep.description
        },
        {
            new: true
        })
        .exec()
        .then(doc => {
            Checklist.findById(checklistId)
                .populate("steps.substeps")
                .exec()
                .then(doc => {
                    var info = {
                        patient: pId,
                        clinician: cId,
                        srcElement: "checklist",
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
    var pId = req.originalUrl.split('/')[2];
    var cId = req.body.cId;
    var checklistId = req.params.id;
    var stepId = req.params.stepId;
    var substepId = req.params.substepId;

    ChecklistSubstep.deleteMany({ _id: substepId }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            Checklist.findOneAndUpdate({ "_id": checklistId, "steps._id": stepId },
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
                        srcElement: "checklist",
                        operation: "delete",
                        description: "Checklist substep removed"
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