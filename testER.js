/**
 * Error testing script.
 *
 * Covers edge cases and invalid operations to verify:
 * - Step requests for non-existent users
 * - Invalid or unknown step names
 * - Missing required fields in payloads
 * - Interview scheduling mismatches
 * - Rejection based on IQ test score
 * - Re-submission of already completed steps
 *
 * Requires the local server to be running at http://localhost:3000
 */
const axios = require('axios');
const BASE_URL = 'http://localhost:3000/api';

(async () => {
    try {
        console.log('\n TESTING ERROR CASES\n');

        // 0. Get step for non-existent user
        try {
            await axios.get(`${BASE_URL}/users/999/step`);
        } catch (err) {
            console.log(' 0. Non-existent user step:', err.response.data);
        }

        // Create valid user
        const { data: user } = await axios.post(`${BASE_URL}/users`, {
            email: 'badcase@example.com',
            first_name: 'Error',
            last_name: 'Test'
        });
        const userId = user.id;

        // 1. Upload ID when need to pass iq
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Sign Contract',
                step_payload: {
                    passport_number: 'A1234567',
                    timestamp: new Date().toISOString()
                }
            });
        } catch (err) {
            console.log(' 1. Uploaded ID when waiting to iq test', err.response.data);
        }

        //pass iq step
        const iqreq = await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'IQ Test',
            step_payload: { score: 80 }
        });

        // 2. Complete step with invalid step name
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Unknown Step',
                step_payload: {}
            });
        } catch (err) {
            console.log(' 2. Invalid step name:', err.response.data);
        }

        // 2.1schedule interview with prev date
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Interview',
                step_payload: { interview_date: '2022-04-01' }
            });
        } catch (err) {
            console.log(' 2.1. schedule interview with prev date:', err.response.data);
        }

        //schedule correct interview
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Interview',
                step_payload: { interview_date: '2025-04-01' }
            });
        } catch (err) {
            console.log(' 2.2. schedule correct interview failed:', err.response.data);
        }

        // 3. Perform interview with missing data
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Interview',
                step_payload: { interview_date: '2025-04-01' } 
            });
        } catch (err) {
            console.log(' 3. Incomplete interview data:', err.response.data);
        }

        // 4. Interview date mismatch
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Interview',
                step_payload: {
                    interview_date: '2025-04-02', 
                    interviewer_id: 'int-1',
                    decision: 'passed_interview'
                }
            });
        } catch (err) {
            console.log(' 4. Interview date mismatch:', err.response.data);
        }

        // 5. Low IQ score (should reject user)
        const newUserRes = await axios.post(`${BASE_URL}/users`, {
            email: 'rejected@example.com',
            first_name: 'Reject',
            last_name: 'Case'
        });
        const rejectedId = newUserRes.data.id;

        const rejectRes = await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: rejectedId,
            step_name: 'IQ Test',
            step_payload: { score: 40 }
        });

        console.log('Low IQ response:', rejectRes.data);

        const statusCheck = await axios.get(`${BASE_URL}/users/${rejectedId}/status`);
        console.log('5. Status after rejection:', statusCheck.data);

        // 6. Try completing already completed task
        try {
            const resRepeat = await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'IQ Test',
                step_payload: { score: 80 }
            });
        } catch (err) {
            console.log('6. Re-submitting completed step:', err.response.data);
        }

        console.log('\nVVV Error testing completed. VVV\n');

    } catch (err) {
        console.error('Unexpected failure:', err.response?.data || err.message);
    }
})();
