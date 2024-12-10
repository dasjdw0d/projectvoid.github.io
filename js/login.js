async function handleLogin(event) {
    event.preventDefault();
    
    // Input validation
    const csrfToken = document.querySelector("[name='csrf']")?.value;
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!csrfToken || !username || !password) {
        showNotification('error', 'All fields are required.');
        return;
    }

    try {
        const formData = new URLSearchParams({
            csrf: csrfToken,
            username: username,
            password: password
        });

        const response = await fetch("server/login.php?type=login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
        });

        const data = await response.json();

        if (data.status === 'success') {
            showNotification('success', data.message);
            window.location.href = 'home';
        } else {
            showNotification('error', data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        showNotification('error', 'Something went wrong while logging in.');
    }
}
