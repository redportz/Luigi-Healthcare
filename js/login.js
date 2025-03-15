import config from "./config";
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const enteredEmail = document.getElementById("email").value;
    const enteredPassword = document.getElementById("password").value;
    let user=null;

    if (!useRealAPI) {
        if (enteredEmail === "AdminTest@email.com" && enteredPassword === "pass123") {
            // Admin test login: simulate user data for an Administrator
            user = { firstName: "Admin", lastName: "Test", role: "Administrator" };
        } else if (enteredEmail === "DoctorTest@email.com" && enteredPassword === "pass123") {
            // Doctor test login: simulate user data for a Doctor
            user = { firstName: "Doctor", lastName: "Test", role: "Doctor" };
        } else if (enteredEmail === "PatientTest@email.com" && enteredPassword === "pass123") {
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
            const response = await fetch(config.API_ENDPOINTS.login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: enteredEmail, password: enteredPassword }) 
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Real API Login Successful:", result);


                handleLoginSuccess(result); 
            } else {
                throw new Error(await response.text()); 
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

function storeUserData(user) {
    localStorage.setItem("user", JSON.stringify(user));

}
