document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('api/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'login',
                        username: username,
                        password: password
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    // Save token to localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const response = await fetch('api/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'register',
                        username: username,
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration');
            }
        });
    }

    // Check if user is logged in
    function checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            // Redirect to login if not authenticated
            if (window.location.pathname !== '/login.html' && 
                window.location.pathname !== '/signup.html') {
                window.location.href = 'login.html';
            }
        } else {
            // Redirect to dashboard if already authenticated
            if (window.location.pathname === '/login.html' || 
                window.location.pathname === '/signup.html') {
                window.location.href = 'dashboard.html';
            }
        }
    }

    // Check authentication status on page load
    checkAuth();
}); 