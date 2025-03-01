document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    // 🔹 MOCK MODE: Check JSON File (Fetching user details from JSON file)
    try {
        const jsonResponse = await fetch("/var/www/Luigi-Healthcare/json/accounts"); // Ensure this file exists
        const users = await jsonResponse.json();

        // Find user in the mock JSON database
        const user = users.find(user => user.username === enteredUsername && user.password === enteredPassword);

        if (user) {
            console.log("✅ Mock Login Successful:", user);
            handleLoginSuccess(user); // Process user role & redirect
            return; // Exit function to avoid making the real API call
        } else {
            alert("Invalid username or password.");
            return;
        }
    } catch (jsonError) {
        console.warn("⚠ JSON file not found or error reading it:", jsonError);
        alert("Error: Unable to load local user data.");
        return;
    }

    // 🔹 REAL API CALL (Commented Out for Now)
    /*
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: enteredUsername, password: enteredPassword })
        });

        if (response.ok) {
            const result = await response.json();
            console.log("✅ Real API Login Successful:", result);
            handleLoginSuccess(result); // Redirect & store data
        } else {
            throw new Error(await response.text()); // Handles error message properly
        }
    } catch (apiError) {
        console.error("API Call Failed:", apiError);
        alert("Login failed. Please try again.");
    }
    */
});

// 🔹 Function to handle login success, store user data & redirect
function handleLoginSuccess(user) {
    // Store user info for session use
    storeUserData(user);

    // Redirect based on role
    switch (user.role) {
        case "Patient":
            window.location.href = "/patient-dashboard.html";
            break;
        case "Doctor":
            window.location.href = "/doctor-dashboard.html";
            break;
        case "Administrator":
            window.location.href = "/admin-dashboard.html";
            break;
        default:
            alert("Unknown role. Please contact support.");
    }
}

// 🔹 Function to store user info in localStorage (or cookies)
function storeUserData(user) {
    // Choose between localStorage and cookies (comment out the one you don’t want)

    // ✅ OPTION 1: Store in localStorage (temporary but clears on logout)
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ OPTION 2: Store in cookies (useful if you need persistence)
    /*
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400;`; // Expires in 1 day
    */
}
