
document.addEventListener('DOMContentLoaded', async () => {
    const usernameDisplay = document.getElementById('usernameDisplay');
        const bookList = document.getElementById('bookList');
        const bookMessage = document.getElementById('bookMessage');
        const logoutBtn = document.getElementById('logoutBtn');

        // Check for token and user data on page load
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        let user = null;

        if (userString) {
            try {
                user = JSON.parse(userString);
            } catch (e) {
                console.error("Error parsing user data from localStorage:", e);
                // Clear corrupted data and force re-login
                localStorage.clear();
                window.location.href = '/login.html';
            }
        }

        // If no token or user data, redirect to login
        if (!token || !user) {
            window.location.href = '/login.html';
        } else {
            usernameDisplay.textContent = user.username || 'User';

            // Function to fetch protected data (e.g., books)
            async function fetchProtectedData() {
                try {
                    const response = await fetch('/api/books', { // This route is protected by your Express middleware
                        headers: {
                            'Authorization': `Bearer ${token}` // Send the JWT in the Authorization header
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        bookList.innerHTML = ''; // Clear loading message
                        if (data.length > 0) {
                            data.forEach(book => {
                                const li = document.createElement('li');
                                li.textContent = `${book.title} by ${book.author} (Genre: ${book.genre || 'N/A'})`;
                                bookList.appendChild(li);
                            });
                        } else {
                            bookList.textContent = 'No books found in your collection.';
                        }
                    } else if (response.status === 401) {
                        // Token expired or invalid, force re-login
                        alert('Your session has expired. Please log in again.');
                        localStorage.clear();
                        window.location.href = '/login.html';
                    } else {
                        bookMessage.textContent = data.message || 'Failed to load books.';
                    }
                } catch (error) {
                    console.error('Error fetching protected data:', error);
                    bookMessage.textContent = 'An error occurred while fetching data.';
                }
            }

            fetchProtectedData(); // Call this function when the page loads

            logoutBtn.addEventListener('click', () => {
                localStorage.clear(); // Remove token and user data
                window.location.href = '/login.html'; // Redirect to login page
            });
        }
});