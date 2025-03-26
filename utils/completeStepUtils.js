const flow = require('../models/flowModel');

/**
 * Handle logic for the IQ Test step.
 * Updates task completion and may reject the user based on score.
 *
 * Parameters:
 * - user: The user object
 * - payload: Contains the score
 *
 * Returns:
 * - null if valid
 * - Error message if score is missing
 */
function handleIqTest(user, payload) {
    const { score } = payload;
    if (score === undefined) return 'Missing IQ score';

    user.progress['IQ Test']['iq_test'] = score >= 75;
    if (score < 75) user.status = 'rejected';

    return null;
}

/**
 * Handle scheduling of the interview step.
 * Stores the interview date and marks the task as complete.
 *
 * Parameters:
 * - user: The user object
 * - payload: Contains interview_date
 *
 * Returns:
 * - null if valid
 * - Error message if interview_date is missing or incorrect
 */
function handleScheduleInterview(user, payload) {
    const { interview_date } = payload;
    if (!interview_date) return 'Missing interview_date';
    const scheduledDate = new Date(interview_date);
    const now = new Date();

    if (isNaN(scheduledDate.getTime())) {
        return 'Invalid interview_date format';
    }

    if (scheduledDate <= now) {
        return 'Interview must be scheduled for a future date';
    }
    user.interview_date = interview_date;
    user.progress['Interview']['schedule_interview'] = true;

    return null;
}

/**
 * Handle performing the interview.
 * Validates input, matches scheduled date, and updates pass/fail status.
 *
 * Parameters:
 * - user: The user object
 * - payload: Contains interview_date, interviewer_id, and decision
 *
 * Returns:
 * - null if successful
 * - Error message if validation fails or decision is negative
 */
function handlePerformInterview(user, payload) {
    const { interview_date, interviewer_id, decision } = payload;
    if (!interview_date || !interviewer_id || !decision)
        return 'Missing interview data';

    if (interview_date !== user.interview_date)
        return 'Interview date mismatch';

    user.interviewer_id = interviewer_id;
    const passed = decision === 'passed_interview';
    user.progress['Interview']['perform_interview'] = passed;
    if (!passed) user.status = 'rejected';
    return null;
}

/**
 * Handle upload of identification document.
 * Saves passport info and marks the task as complete.
 *
 * Parameters:
 * - user: The user object
 * - payload: Contains passport_number and timestamp
 *
 * Returns:
 * - null if successful
 * - Error message if data is missing
 */
function handleUploadId(user, payload) {
    const { passport_number, timestamp } = payload;
    if (!passport_number || !timestamp)
        return 'Missing passport_number or timestamp';

    user.passport_number = passport_number;
    user.passport_uploaded_at = timestamp;
    user.progress['Sign Contract']['upload_id'] = true;

    return null;
}

/**
 * Handle signing the contract.
 * Saves the signing timestamp and marks the task as complete.
 *
 * Parameters:
 * - user: The user object
 * - payload: Contains timestamp
 *
 * Returns:
 * - null if successful
 * - Error message if timestamp is missing
 */
function handleSignContract(user, payload) {
    const { timestamp } = payload;
    if (!timestamp) return 'Missing timestamp';

    user.contract_signed_at = timestamp;
    user.progress['Sign Contract']['sign_contract'] = true;

    return null;
}

/**
 * Generic handler for simple tasks (like Payment or Join Slack).
 *
 * Parameters:
 * - user: The user object
 * - step_name: The step the task belongs to
 * - task: The task name to mark as completed
 *
 * Returns:
 * - null
 */
function handleGenericTask(user, step_name, task) {
    user.progress[step_name][task] = true;
    return null;
}

/**
 * Dispatches task handling based on step name and payload content.
 * Delegates to the appropriate handler based on task type.
 *
 * Parameters:
 * - user: The user object
 * - step_name: The name of the current step
 * - payload: Data associated with the step
 *
 * Returns:
 * - null if task was handled successfully
 * - Error message if validation fails or step is unrecognized
 */
function handleTask({ user, step_name, payload }) {
    const result = getCurrentStepWithFirstTask(user);
    if (!result)
        return 'All steps completed!';
    if (step_name !== result.step) 
        return `You are currently on '${result.step}'. Cannot complete '${step_name}'`

    if (step_name === 'IQ Test')
        return handleIqTest(user, payload);

    if (step_name === 'Interview') {
        if (result.task === 'perform_interview')
            return handlePerformInterview(user, payload);
        if (result.task === 'schedule_interview')
            return handleScheduleInterview(user, payload);
        return 'Missing interview-related data';
    }

    if (step_name === 'Sign Contract') {
        if (result.task === 'upload_id')
            return handleUploadId(user, payload);
        if (result.task === 'sign_contract')
            return handleSignContract(user, payload);
        return 'incorrect step';
    }

    if (step_name === 'Payment')
        return handleGenericTask(user, step_name, 'payment');

    if (step_name === 'Join Slack')
        return handleGenericTask(user, step_name, 'join_slack');
    
    return 'Unrecognized step or missing payload fields';
}

/**
 * Returns the current step and the first incomplete task for the user.
 *
 * user - The user object
 * Object|| null - { step: 'Step Name', task: 'first_incomplete_task' } or null if all complete
 */
function getCurrentStepWithFirstTask(user) {
    for (const step of flow) {
        const taskStatuses = user.progress[step.step];
        for (const task of step.tasks) {
            if (!taskStatuses[task]) {
                return {
                    step: step.step,
                    task
                };
            }
        }
    }

    return null;
}


module.exports = {
    handleTask
};
