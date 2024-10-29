let isRegistering = true; // Default to registering

async function handleAuth(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = isRegistering ? 'http://localhost:5000/register' : 'http://localhost:5000/login'; // Use the correct URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json(); // Parse JSON response
        if (result.success) {
            if (isRegistering) {
                alert("Registration successful, please log in.");
                toggleForm(); // Switch to login form
            } else {
                loginSuccess(); // Show welcome message on successful login
            }
        } else {
            alert(result.message || "An error occurred. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to toggle between register and login
function toggleForm() {
    isRegistering = !isRegistering; // Toggle the value
    document.getElementById("form-title").innerText = isRegistering ? "Register" : "Login"; // Change the title
    document.getElementById("submit-btn").innerText = isRegistering ? "Register" : "Login"; // Change button text
    document.getElementById("toggle-text").innerHTML = isRegistering ? 
        'Already have an account? <span onclick="toggleForm()">Login</span>' :
        'Don\'t have an account? <span onclick="toggleForm()">Register</span>'; // Change the toggle text
    document.getElementById("username").value = ''; // Clear username field
    document.getElementById("password").value = ''; // Clear password field
}

function loginSuccess() {
    document.getElementById("form-container").style.display = "none"; // Hide the form
    document.getElementById("welcome-message").style.display = "block"; // Show welcome message
    fetchUsers(); // Fetch and display users after successful login
}

function logout() {
    document.getElementById("form-container").style.display = "block"; // Show the form again
    document.getElementById("welcome-message").style.display = "none"; // Hide welcome message
}

// Fetch users from the database
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:5000/users'); // Ensure this route exists on your server
        const users = await response.json();

        const userList = document.getElementById('user-list');
        userList.innerHTML = ''; // Clear existing users

        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Username: ${user.username}`;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
fetchUsers()
