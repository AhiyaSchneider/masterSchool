/**
 * Defines the full admissions flow configuration.
 *
 * Each step contains:
 * - step: The name of the step
 * - tasks: An array of tasks required to complete the step
 *
 * This structure is used to initialize user progress and track completion.
 */
const flow = [
    { step: 'Personal Details Form', tasks: ['form'] },
    { step: 'IQ Test', tasks: ['iq_test'] },
    { step: 'Interview', tasks: ['schedule_interview', 'perform_interview'] },
    { step: 'Sign Contract', tasks: ['upload_id', 'sign_contract'] },
    { step: 'Payment', tasks: ['payment'] },
    { step: 'Join Slack', tasks: ['join_slack'] }
];

module.exports = flow;