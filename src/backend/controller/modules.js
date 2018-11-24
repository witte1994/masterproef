exports.get_module_list = (req, res, next) => {
    var modulesLarge = [
        {
            "module": "allergy-element",
            "title": "Allergies"
        },
        {
            "module": "prescription-element",
            "title": "Prescriptions"
        },
        {
            "module": "vaccination-element",
            "title": "Vaccinations"
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
        }
    ]

    res.status(200).json(
        {
            "large": modulesLarge,
            "small": modulesSmall
        }
    );
};