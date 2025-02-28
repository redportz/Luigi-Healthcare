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

    try {
        const response = await fetch("http://localhost:5000/api/patients/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // ✅ Redirect to "account-created.html" after successful account creation
            window.location.href = "/account-stuff/account-created.html";
        } else {
            const errorMessage = await response.text();
            alert("Error: " + errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to create account. Please try again.");
    }
});


