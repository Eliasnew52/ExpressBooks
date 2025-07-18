
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = ''; // Clear previous messages

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // Ensure this matches your backend (username or email)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Store the token
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                username: data.username,
                email: data.email // Make sure your login route sends email if you need it
            })); // Store user info (optional)
            window.location.href = '/index.html'; // Redirect to the protected index page
        } else {
            messageDiv.textContent = data.message || 'Login failed. Please check your credentials.';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageDiv.textContent = 'An error occurred during login. Please try again later.';
    }
});
