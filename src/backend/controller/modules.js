var modulesLarge = [
    {
        "module": "allergy-element",
        "title": "Allergies",
        "enum": "allergy"
    },
    {
        "module": "prescription-element",
        "title": "Prescriptions",
        "enum": "prescription"
    },
    {
        "module": "vaccination-element",
        "title": "Vaccinations",
        "enum": "vaccination"
    },
    {
        "module": "history-element",
        "title": "History",
        "enum": "history"
    },
    {
        "module": "workflow-element",
        "title": "Workflow",
        "enum": "workflow"
    },
    {
        "module": "checklist-element",
        "title": "Checklist",
        "enum": "checklist"
    },
    {
        "module": "telemonitoring-element",
        "title": "Telemonitoring",
        "enum": "tm"
    }
];

var modulesSmall = [
    {
        "module": "allergy-element-small",
        "title": "Allergies"
    },
    {
        "module": "prescription-element-small",
        "title": "Prescriptions"
    },
    {
        "module": "vaccination-element-small",
        "title": "Vaccinations"
    },
    {
        "module": "telemonitoring-element-small",
        "title": "Telemonitoring"
    }
];

exports.get_module_list = (req, res, next) => {
    res.status(200).json(
        {
            "large": modulesLarge,
            "small": modulesSmall
        }
    );
};

exports.getEnums = () => {
    var enums = [
        "patient",
        "medication",
        "other"
    ];

    for (var i = 0; i < modulesLarge.length; i++)
        enums.push(modulesLarge[i].enum);

    return enums;
};