
document.addEventListener('DOMContentLoaded', async () => {
    const bookList = document.getElementById('book-list');

    try {
        // Fetch data from your Express API
        const response = await fetch('/api/books'); // Relative URL, points to your Express server
        const books = await response.json(); // Parse the JSON response

        if (books.length === 0) {
            bookList.innerHTML = '<li>No books found. Add some using Postman!</li>';
        } else {
            // Clear the loading message
            bookList.innerHTML = '';

            // Iterate over the books and create HTML list items
            books.forEach(book => {
                const listItem = document.createElement('li');
                const date = new Date(book.createdAt);
                date.toLocaleDateString();
                // Set the inner HTML of the list item with book details
                listItem.innerHTML = `
                    <strong>Title:</strong> ${book.title}<br>
                    <strong>Author:</strong> ${book.author}<br>
                    <strong>ISBN:</strong> ${book.isbn}<br>
                    <img src="${book.thumbnail}" alt="${book.title} thumbnail" style="max-width: 100px; height: auto; margin-top: 5px;"><br>
                    <small>Uploaded on: ${date || 'N/A'}</small>
                `;
                bookList.appendChild(listItem);
            });
        }

    } catch (error) {
        console.error('Error fetching books:', error);
        bookList.innerHTML = '<li>Error loading books. Please try again later.</li>';
    }
});