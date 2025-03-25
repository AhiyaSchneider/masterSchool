const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

(async () => {
    try {
        // 0. try getting un declared user
        const failingRes = await axios.get(`${BASE_URL}/users/0/step`);
        console.log('V Current Step:', failingRes.data);

        // 1. Create a user
        const userRes = await axios.post(`${BASE_URL}/users`, {
            email: 'achia@example.com',
            first_name: 'Achia',
            last_name: 'Schnider'
        });
        const userId = userRes.data.id;
        console.log('V Created user:', userId);

        // 2. Get flow
        const flowRes = await axios.get(`${BASE_URL}/flow`);
        console.log('V Flow:', flowRes.data);

        // 3. Get current step
        const stepRes = await axios.get(`${BASE_URL}/users/${userId}/step`);
        console.log('V Current Step:', stepRes.data);

        // 4. Complete IQ Test
        const completeRes = await axios.put(`${BASE_URL}/steps/complete`, {
            user_id: userId,
            step_name: 'IQ Test',
            step_payload: {
                score: 82
            }
        });
        console.log('V Completed IQ Test:', completeRes.data);

        // 4. Get current step
        const stepRes2 = await axios.get(`${BASE_URL}/users/${userId}/step`);
        console.log('V Current Step:', stepRes2.data);

        // 5. Get user status
        const statusRes = await axios.get(`${BASE_URL}/users/${userId}/status`);
        console.log('V User Status:', statusRes.data);

    } catch (err) {
        console.error('F Error:', err.response?.data || err.message);
    }
})();
