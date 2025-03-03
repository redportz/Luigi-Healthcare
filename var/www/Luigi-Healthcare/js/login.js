document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission
    // Toggle flag: set to false for simulated login, true for real API call.
    const useRealAPI=false;
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;
    let user=null;

    if (!useRealAPI) {
        if (enteredUsername === "AdminTest" && enteredPassword === "pass123") {
            // Admin test login: simulate user data for an Administrator
            user = { firstName: "Admin", lastName: "Test", role: "Administrator" };
        } else if (enteredUsername === "DoctorTest" && enteredPassword === "pass123") {
            // Doctor test login: simulate user data for a Doctor
            user = { firstName: "Doctor", lastName: "Test", role: "Doctor" };
        } else if (enteredUsername === "PatientTest" && enteredPassword === "pass123") {
            // Patient test login: simulate user data for a Patient
            user = { firstName: "Patient", lastName: "Test", SSN: "123456789", role: "Patient" };
        } else {
            alert("Login failed. Please try again.");
            return; 
        }
        handleLoginSuccess(user)
    }
    else{
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
                console.log("Real API Login Successful:", result);
                handleLoginSuccess(result); // Redirect & store data
            } else {
                throw new Error(await response.text()); // Handles error message properly
            }
        } catch (apiError) {
            console.error("API Call Failed:", apiError);
            alert("Login failed. Please try again.");
        }
}
});

// 🔹 Function to handle login success, store user data & redirect
function handleLoginSuccess(user) {
    // Store user info for session use
    storeUserData(user);

    // Redirect based on role
    switch (user.role) {
        case "Patient":
            window.location.href = "../Patient/Dashboard.html";
            break;
        case "Doctor":
            window.location.href = "../Doctor/Dashboard.html";
            break;
        case "Administrator":
            window.location.href = "../admin/Dashboard.html";
            break;
        default:
            alert("Unknown role. Please contact support.");
    }
}

// 🔹 Function to store user info in localStorage (or cookies)
function storeUserData(user) {
    localStorage.setItem("user", JSON.stringify(user));

}
