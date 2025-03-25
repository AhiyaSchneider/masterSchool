const flow = require('../models/flowModel');
const User = require('../models/userModel');

const users = {}; // In-memory storage (wiped on server restart)

// 1. Create a new user
function createUser(email, first_name, last_name) {
    const newUser = new User(email);
    users[newUser.id] = newUser;
    return { id: newUser.id };
}

// 2. Get the full admissions flow (step names only)
function getFlow() {
    return flow.map(step => step.step);
}

// 3. Get the current step & pending tasks for a user
function getCurrentStep(userId) {
    const user = users[userId];
    if (!user) return { error: 'User not found' };

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

// 4. Complete a step (and apply any pass/fail logic)
function completeStep({ user_id, step_name, step_payload }) {
    const user = users[user_id];
    if (!user) return { error: 'User not found' };

    const step = flow.find(s => s.step === step_name);
    if (!step) return { error: 'Invalid step name' };

    if (!user.progress[step_name]) return { error: 'Step not initialized for user' };

    for (const task of step.tasks) {
        if (task === 'iq_test') {
            const score = step_payload.score;
            if (score > 75) {
                user.progress[step_name][task] = true;
            } else if (score < 60) {
                user.status = 'rejected';
                user.progress[step_name][task] = false;
            } else {
                // 60–75 second chance (not shown in flow)
                user.progress[step_name][task] = false;
                // you could log this or set a flag
            }
        } else if (task === 'perform_interview') {
            const passed = step_payload.decision === 'passed_interview';
            user.progress[step_name][task] = passed;
            if (!passed) user.status = 'rejected';
        } else {
            // Default: mark task as completed
            user.progress[step_name][task] = true;
        }
    }

    // Check if all steps are now complete
    const allDone = flow.every(s =>
        s.tasks.every(t => user.progress[s.step][t])
    );

    if (allDone && user.status === 'in_progress') {
        user.status = 'accepted';
    }

    return { success: true };
}

// 5. Get the user's status
function getStatus(userId) {
    const user = users[userId];
    if (!user) return { error: 'User not found' };
    return { status: user.status };
}

module.exports = {
    createUser,
    getFlow,
    getCurrentStep,
    completeStep,
    getStatus
};
