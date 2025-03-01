document.getElementById("patient-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        dateOfBirth: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        insuranceName: document.getElementById("insurance-name").value,
        memberId: document.getElementById("member-id").value
    };

    // 🔹 MOCK MODE: Check JSON File (Fake account creation, can be commented out later)
    try {
        const jsonResponse = await fetch("http://127.0.0.1:5500/var/www/Luigi-Healthcare/json/accounts.json"); // Ensure this file exists and is accessible
        const users = await jsonResponse.json();

        // Check if the user already exists
        const existingUser = users.find(user => user.email === formData.email);
        if (existingUser) {
            alert("An account with this email already exists.");
            return;
        }

        // Simulate adding a new user to the JSON file (in reality, you'd need a backend to write to the file)
        users.push({ ...formData, role: "Patient" });

        // Send updated data back to the server to overwrite the JSON file
        await fetch("/save-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(users)
        });

        console.log("✅ Mock Account Created:", formData);

        // Simulate successful account creation
        document.getElementById("patient-form").style.display = "none";
        document.getElementById("account-created-message").style.display = "flex";
        return; // Exit function to avoid making the real API call
    } catch (jsonError) {
        console.warn("⚠ JSON file not found or error reading it:", jsonError);
        alert("Error: Unable to load local user data.");
        return;
    }


    // 🔹 REAL API CALL (Commented Out for Now)
    /*
    try {
        const response = await fetch("http://localhost:5000/api/patients/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log("✅ Real API Account Created:", formData);
            document.getElementById("patient-form").style.display = "none";
            document.getElementById("account-created-message").style.display = "flex";
        } else {
            const errorMessage = await response.text();
            alert("Error: " + errorMessage);
        }
    } catch (error) {
        console.error("API Call Failed:", error);
        alert("Failed to create account. Please try again.");
    }
    */
});