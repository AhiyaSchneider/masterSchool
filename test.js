/**
 * Test script.
 *
 * Simulates a complete user journey through the admissions process:
 * - Creates a user
 * - Retrieves personalized admissions flow
 * - Progresses through each step, completing tasks
 * - Logs updated flow at key stages
 * - Verifies final step and user status
 *
 * Requires the local server to be running at http://localhost:3000
 */
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

(async () => {
    try {

        // 1. Create a user
        const userRes = await axios.post(`${BASE_URL}/users`, {
            email: 'achia@example.com',
            first_name: 'Achia',
            last_name: 'Schnider'
        });
        const userId = userRes.data.id;
        console.log('1. Created user:', userId);

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

        // 6. Get updated user flow
        const flowRes = await axios.get(`${BASE_URL}/users/${userId}/flow`);
        console.log('6. User Flow:\n', JSON.stringify(flowRes.data, null, 2));

        // 7. Perform Interview
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Interview',
            step_payload: {
                interview_date: '2025-04-01',
                interviewer_id: 'int-123',
                decision: 'passed_interview'
            }
        });
        console.log('7. Performed Interview');

        // 8. Upload ID
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Sign Contract',
            step_payload: {
                passport_number: 'A1234567',
                timestamp: new Date().toISOString()
            }
        });
        console.log('8. Uploaded ID');

        // 9. Sign Contract
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Sign Contract',
            step_payload: {
                timestamp: new Date().toISOString()
            }
        });
        console.log('9. Signed Contract');

        // 10. Make Payment
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Payment',
            step_payload: {
                payment_id: 'pay-999',
                timestamp: new Date().toISOString()
            }
        });
        console.log('10. Payment Completed');

        // 11. Join Slack
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Join Slack',
            step_payload: {
                email: 'achia@example.com',
                timestamp: new Date().toISOString()
            }
        });
        console.log('11. Joined Slack');

        // 12. Final Step Check
        const finalStep = await axios.get(`${BASE_URL}/users/${userId}/step`);
        console.log('12. Final Step:', finalStep.data);

        // 13. Final Status Check
        const finalStatus = await axios.get(`${BASE_URL}/users/${userId}/status`);
        console.log('13. Final User Status:', finalStatus.data);

    } catch (err) {
        console.error('F Error:', err.response?.data || err.message);
    }
})();
