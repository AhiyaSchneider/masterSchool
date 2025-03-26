const flow = require('./flowModel');

/**
 * User model definition.
 *
 * Represents an applicant progressing through the admissions flow.
 * Initializes with default status, timestamp, and a progress object
 * based on the defined flow structure.
 *
 * Fields:
 * - id: Unique user ID (auto-incremented)
 * - timestamp: Time of creation
 * - status: Current status ('in_progress', 'accepted', 'rejected')
 * - personal_info: Object containing email, first_name, last_name
 * - progress: Object tracking task completion by step and task name
 * - interview: Stores scheduled date and interviewer ID
 * - contract: Stores uploaded passport info and signing timestamp
 */
let userIdCounter = 1;

function initializeProgress() {
    const progress = {};
    flow.forEach(step => {
        progress[step.step] = {};
        step.tasks.forEach(task => {
            progress[step.step][task] = false;
        });
    });
    progress['Personal Details Form']['form'] = true;
    return progress;
}

class User {
    constructor({ email, first_name, last_name }) {
        this.id = userIdCounter++;
        this.timestamp = new Date().toISOString();
        this.status = 'in_progress';
        this.personal_info = { email, first_name, last_name };
        this.progress = initializeProgress();
        this.interview = { date: null, interviewer_id: null };
        this.contract = { passport_number: null, passport_uploaded_at: null, signed_at: null };
    }
}


module.exports = User;
