const admissionsUtils = require('../utils/admissionsUtils');

/**
 * Create a new user in the system.
 *
 * Expected request body with email, first_name, last_name params.
 * 
 * Returns:
 * - 200 OK with { id: userId } if successful
 * - 400 Bad Request with { error: 'Missing required fields' } if input is invalid
 */
exports.createUser = (req, res) => {
    const { email, first_name, last_name } = req.body;
    if (!req.body || !email || !first_name || !last_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = admissionsUtils.createUser(email, first_name, last_name);
    res.status(200).json(result);
};

/**
 * Get the full admissions flow with user progress.
 *
 * Path parameter:
 * - userId: ID of the user
 *
 * Returns:
 * - 200 OK with the flow, total steps, and current step index
 * - 400 Bad Request if userId is missing
 * - 404 Not Found if the user does not exist
 */
exports.getFlow = (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
    }

    const result = admissionsUtils.getFlow(userId);
    if (result.error) return res.status(404).json(result);

    res.status(200).json(result);
};


/**
 * Get the current step and pending tasks for a specific user.
 *
 * Path parameter:
 * - userId: ID of the user whose progress should be retrieved.
 *
 * Returns:
 * - 200 OK with the current step and list of pending tasks.
 * - 400 Bad Request if userId is missing.
 * - 404 Not Found if the user does not exist.
 */
exports.getCurrentStep = (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
    }
    const result = admissionsUtils.getCurrentStep(userId);

    if (result.error) return res.status(404).json(result);
    res.status(200).json(result);
};

/**
 * Mark a step as completed for a specific user.
 *
 * Expected request body with  user_id, step_name, step_payload.
 *
 * Returns:
 * - 200 OK with a success message or status info
 * - 400 Bad Request if required fields are missing or invalid
 */
exports.completeStep = (req, res) => {
    const result = admissionsUtils.completeStep(req.body);

    if (result.error) return res.status(400).json(result);
    res.status(200).json(result);
};

/**
 * Get the current admission status of a specific user.
 *
 * Path parameter userId.
 *
 * Returns:
 * - 200 OK with the user's status (accepted, rejected, or in_progress)
 * - 400 Bad Request if userId is missing
 * - 404 Not Found if the user does not exist
 */
exports.getStatus = (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
    }
    const result = admissionsUtils.getStatus(userId);

    if (result.error) return res.status(404).json(result);
    res.status(200).json(result);
};
