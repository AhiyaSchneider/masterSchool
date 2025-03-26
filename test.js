const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

(async () => {
    try {
        // 0. Try getting undeclared user
        //const failingRes = await axios.get(`${BASE_URL}/users/0/step`);
        //console.log('0. Current Step (non-existent user):', failingRes.data);

        // 1. Create a user
        const userRes = await axios.post(`${BASE_URL}/users`, {
            email: 'achia@example.com',
            first_name: 'Achia',
            last_name: 'Schnider'
        });
        const userId = userRes.data.id;
        console.log('1. Created user:', userId);

        // 2. Get flow
        const flowRes = await axios.get(`${BASE_URL}/users/${userId}/flow`);
        console.log('2. User Flow:\n', JSON.stringify(flowRes.data, null, 2));



        // 3. Get current step
        const stepRes = await axios.get(`${BASE_URL}/users/${userId}/step`);
        console.log('3. Current Step:', stepRes.data);

        // 4. Complete IQ Test
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'IQ Test',
            step_payload: { score: 82 }
        });
        console.log('4. Completed IQ Test');

        // 5. Schedule Interview
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Interview',
            step_payload: { interview_date: '2025-04-01' }
        });
        console.log('5. Scheduled Interview');

        // 22. Get updated user flow
        const flowRes22 = await axios.get(`${BASE_URL}/users/${userId}/flow`);
        console.log('22. User Flow:\n', JSON.stringify(flowRes22.data, null, 2));


        // 6. Perform Interview
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Interview',
            step_payload: {
                interview_date: '2025-04-01',
                interviewer_id: 'int-123',
                decision: 'passed_interview'
            }
        });
        console.log('6. Performed Interview');

        // 33. Get updated user flow
        const flowRes33 = await axios.get(`${BASE_URL}/users/${userId}/flow`);
        console.log('33. User Flow:\n', JSON.stringify(flowRes33.data, null, 2));

        // 7. Upload ID
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Sign Contract',
            step_payload: {
                passport_number: 'A1234567',
                timestamp: new Date().toISOString()
            }
        });
        console.log('7. Uploaded ID');

        // 8. Sign Contract
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Sign Contract',
            step_payload: {
                timestamp: new Date().toISOString()
            }
        });
        console.log('8. Signed Contract');

        // 9. Make Payment
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Payment',
            step_payload: {
                payment_id: 'pay-999',
                timestamp: new Date().toISOString()
            }
        });
        console.log('9. Payment Completed');

        // 10. Join Slack
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Join Slack',
            step_payload: {
                email: 'achia@example.com',
                timestamp: new Date().toISOString()
            }
        });
        console.log('10. Joined Slack');

        // 11. Final Step Check
        const finalStep = await axios.get(`${BASE_URL}/users/${userId}/step`);
        console.log('11. Final Step:', finalStep.data);

        // 12. Final Status Check
        const finalStatus = await axios.get(`${BASE_URL}/users/${userId}/status`);
        console.log('12. Final User Status:', finalStatus.data);

    } catch (err) {
        console.error('F Error:', err.response?.data || err.message);
    }
})();
