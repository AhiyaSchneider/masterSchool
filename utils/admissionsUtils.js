const flow = require('../models/flowModel');
const User = require('../models/userModel');
const { handleTask } = require('./completeStepUtils');

const users = {}; // In-memory storage (wiped on server restart)

/**
 * Create a new user and initialize their progress through the admission flow.
 *
 * Parameters:
 * - email: User's email address
 * - first_name: User's first name
 * - last_name: User's last name
 *
 * Returns:
 * - Object containing the new user's ID
 */
function createUser(email, first_name, last_name) {
    const newUser = new User({ email, first_name, last_name });
    users[newUser.id] = newUser;
    return { id: newUser.id };
}

/**
 * Retrieve the full admissions flow with task completion status for a specific user.
 *
 * Parameters:
 * - userId: ID of the user
 *
 * Returns:
 * - Object containing:
 *   - current_step_index: index of the step the user is currently on
 *   - total_steps: total number of steps in the flow
 *   - flow: array of step objects with task completion status
 * - Error object if the user is not found
 */
function getFlow(userId) {
    const user = users[userId];
    if (!user) return { error: 'User ID not found or invalid.' };

    let currentStepIndex = -1;

    const userFlow = flow.map((step, index) => {
        const taskStatuses = user.progress[step.step];
        const allDone = Object.values(taskStatuses).every(done => done);

        if (currentStepIndex === -1 && !allDone) {
            currentStepIndex = index;
        }

        return {
            step: step.step,
            tasks: taskStatuses
        };
    });

    return {
        current_step_index: currentStepIndex,
        total_steps: flow.length,
        flow: userFlow
    };
}


/**
 * Get the current step and any pending tasks for a given user.
 *
 * Parameters:
 * - userId: ID of the user
 *
 * Returns:
 * - 200 OK with the current step and list of incomplete tasks
 * - Error object if user is not found
 * -  message if all steps are completed
 */
function getCurrentStep(userId) {
    const user = users[userId];
    if (!user) return { error: 'User ID not found or invalid.' };

    for (const step of flow) {
        const tasks = step.tasks;
        const completed = tasks.every(task => user.progress[step.step][task]);

        if (!completed) {
            const pendingTasks = tasks.filter(task => !user.progress[step.step][task]);
            return { step: step.step, tasks: pendingTasks };
        }
    }

    return { message: 'All steps complete' };
}

/**
 * Mark a specific step as completed for a user based on the given payload.
 * Also applies conditional logic for pass/fail steps.
 *
 * Parameters:
 * - user_id: ID of the user
 * - step_name: Name of the step
 * - step_payload: Data required to complete the step
 *
 * Returns:
 * - Message indicating step completion
 * - Error object if step or user is invalid or data is missing
 */
function completeStep({ user_id, step_name, step_payload }) {
    const user = users[user_id];
    if (!user) return { error: 'User ID not found or invalid.' };
    const step = flow.find(s => s.step === step_name);
    if (!step) return { error: 'Invalid step name' };

    if (!user.progress[step_name]) return { error: 'Step not initialized for user' };
    const error = handleTask({ user, step_name, payload: step_payload });
    if (error) return { error };

    const allDone = flow.every(s =>
        s.tasks.every(t => user.progress[s.step][t])
    );

    if (allDone && user.status === 'in_progress') {
        user.status = 'accepted';
    }

    return {
        message: 'Step completed.'
    };
}

/**
 * Retrieve the current admission status for a user.
 *
 * Parameters:
 * - userId: ID of the user
 *
 * Returns:
 * - Object with the user's status
 * - Error object if user is not found
 */
function getStatus(userId) {
    const user = users[userId];
    if (!user) return { error: 'User ID not found or invalid.' };
    return { status: user.status };
}

module.exports = {
    createUser,
    getFlow,
    getCurrentStep,
    completeStep,
    getStatus
};
