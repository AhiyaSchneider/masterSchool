function handleIqTest(user, payload) {
    const { score } = payload;
    if (score === undefined) return 'Missing IQ score';

    user.progress['IQ Test']['iq_test'] = score >= 75;
    if (score < 75) user.status = 'rejected';

    return null;
}

function handleScheduleInterview(user, payload) {
    const { interview_date } = payload;
    if (!interview_date) return 'Missing interview_date';

    user.interview_date = interview_date;
    user.progress['Interview']['schedule_interview'] = true;

    return null;
}

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

function handleUploadId(user, payload) {
    const { passport_number, timestamp } = payload;
    if (!passport_number || !timestamp)
        return 'Missing passport_number or timestamp';

    user.passport_number = passport_number;
    user.passport_uploaded_at = timestamp;
    user.progress['Sign Contract']['upload_id'] = true;

    return null;
}

function handleSignContract(user, payload) {
    const { timestamp } = payload;
    if (!timestamp) return 'Missing timestamp';

    user.contract_signed_at = timestamp;
    user.progress['Sign Contract']['sign_contract'] = true;

    return null;
}

function handleGenericTask(user, step_name, task) {
    user.progress[step_name][task] = true;
    return null;
}

function handleTask({ user, step_name, payload }) {
    if (step_name === 'IQ Test') {
        return handleIqTest(user, payload);
    }

    if (step_name === 'Interview') {
        if ('interviewer_id' in payload && 'decision' in payload) {
            return handlePerformInterview(user, payload);
        }
        if ('interview_date' in payload) {
            return handleScheduleInterview(user, payload);
        }
        return 'Missing interview-related data';
    }

    if (step_name === 'Sign Contract') {
        if ('passport_number' in payload) {
            return handleUploadId(user, payload);
        }
        if ('timestamp' in payload && !('passport_number' in payload)) {
            return handleSignContract(user, payload);
        }
        return 'Missing contract-related data';
    }

    if (step_name === 'Payment') {
        return handleGenericTask(user, step_name, 'payment');
    }

    if (step_name === 'Join Slack') {
        return handleGenericTask(user, step_name, 'join_slack');
    }

    return 'Unrecognized step or missing payload fields';
}

module.exports = {
    handleTask
};
