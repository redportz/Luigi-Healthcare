document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const loginData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const result = await response.json();

            // Role-based redirection
            switch (result.role) {
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
        } else {
            const errorMessage = await response.text();
            alert("Login failed: " + errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to log in. Please try again.");
    }
});
