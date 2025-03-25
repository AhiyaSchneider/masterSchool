// models/userModel.js

const flow = require('./flowModel');
const crypto = require('crypto');

let userIdCounter = 1;

class User {
    constructor({ email, first_name, last_name }) {
        this.id = userIdCounter++;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.timestamp = new Date().toISOString();
        this.status = 'in_progress';
        this.progress = {};

        flow.forEach(step => {
            this.progress[step.step] = {};
            step.tasks.forEach(task => {
                this.progress[step.step][task] = false;
            });
        });

        // Mark "Personal Details Form" as completed
        if (this.progress['Personal Details Form']) {
            this.progress['Personal Details Form']['form'] = true;
        }
    }
}

module.exports = User;
