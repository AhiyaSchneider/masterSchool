const axios = require('axios');
const BASE_URL = 'http://localhost:3000/api';

(async () => {
    try {
        console.log('\n?? TESTING ERROR CASES\n');

        // 1. Get step for non-existent user
        try {
            await axios.get(`${BASE_URL}/users/999/step`);
        } catch (err) {
            console.log('? 1. Non-existent user step:', err.response.data);
        }

        // 2. Create valid user
        const { data: user } = await axios.post(`${BASE_URL}/users`, {
            email: 'badcase@example.com',
            first_name: 'Error',
            last_name: 'Test'
        });
        const userId = user.id;
        console.log('? Created test user:', userId);

        // 3. Complete step with invalid step name
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Unknown Step',
                step_payload: {}
            });
        } catch (err) {
            console.log('? 2. Invalid step name:', err.response.data);
        }

        // 4. Perform interview with missing data
        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Interview',
                step_payload: { interview_date: '2025-04-01' } // missing interviewer_id + decision
            });
        } catch (err) {
            console.log('? 3. Incomplete interview data:', err.response.data);
        }

        // 5. Mismatched interview date
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'Interview',
            step_payload: { interview_date: '2025-04-01' }
        }); // scheduling

        try {
            await axios.put(`${BASE_URL}/steps/complete`, {
                user_id: userId,
                step_name: 'Interview',
                step_payload: {
                    interview_date: '2025-04-02', // wrong date
                    interviewer_id: 'int-1',
                    decision: 'passed_interview'
                }
            });
        } catch (err) {
            console.log('? 4. Interview date mismatch:', err.response.data);
        }

        // 6. Low IQ score (should reject user)
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

        console.log('? Low IQ response:', rejectRes.data);

        const statusCheck = await axios.get(`${BASE_URL}/users/${rejectedId}/status`);
        console.log('? 5. Status after rejection:', statusCheck.data);

        // 7. Try completing already completed task
        await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'IQ Test',
            step_payload: { score: 80 }
        });

        const resRepeat = await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'IQ Test',
            step_payload: { score: 85 }
        });

        console.log('?? 6. Re-submitting completed step:', resRepeat.data);

    } catch (err) {
        console.error('?? Unexpected failure:', err.response?.data || err.message);
    }
})();
