const admissionsUtils = require('../utils/admissionsUtils');

// 1. Create a user
exports.createUser = (req, res) => {
    const { email, first_name, last_name } = req.body;
    if (!email || !first_name || !last_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = admissionsUtils.createUser(email, first_name, last_name);
    res.status(200).json(result);
};

// 2. Get the entire admissions flow
exports.getFlow = (req, res) => {
    const result = admissionsUtils.getFlow();
    res.status(200).json(result);
};

// 3. Get the current step for a specific user
exports.getCurrentStep = (req, res) => {
    const { userId } = req.params;
    const result = admissionsUtils.getCurrentStep(userId);

    if (result.error) return res.status(404).json(result);
    res.status(200).json(result);
};

// 4. Mark a step as completed
exports.completeStep = (req, res) => {
    const result = admissionsUtils.completeStep(req.body);

    if (result.error) return res.status(400).json(result);
    res.status(200).json(result);
};

// 5. Get the user’s admission status
exports.getStatus = (req, res) => {
    const { userId } = req.params;
    const result = admissionsUtils.getStatus(userId);

    if (result.error) return res.status(404).json(result);
    res.status(200).json(result);
};
