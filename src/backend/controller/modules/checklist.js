const mongoose = require('mongoose');

const HistoryController = require('./history');
const Checklist = require('../../models/modules/checklist');
const ChecklistSubstep = require('../../models/modules/checklistsubstep');

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

exports.create = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;

    const checklist = new Checklist({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        description: req.body.description,
        steps: []
    });
    checklist
        .save()
        .then(result => {
            var info = {
                patient: pId,
                clinician: cId,
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
};

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
    var pId = req.body.pId;
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
    var pId = req.body.pId;
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

exports.update_substep = (req, res, next) => {
    var pId = req.body.pId;
    var cId = req.body.cId;
    var checklistId = req.params.id;
    var substepId = req.body.id;

    var substep = {
        checked: req.body.checked,
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
    var pId = req.body.pId;
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