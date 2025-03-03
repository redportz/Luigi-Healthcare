// Toggle flag: set to false for simulated mode, true for real API call

document.getElementById("patient-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission
    const useRealAPI = false;
    const today=new Date().toISOString().split("T")[0];
   


    const formData = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        dateOfBirth: document.getElementById("dob").value,
        SSN: document.getElementById("ssn").value,
        email: document.getElementById("email").value,
        insuranceName: document.getElementById("insurance-name").value,
        memberId: document.getElementById("member-id").value,
        role: "Patient"
    };
    
    if (formData.dateOfBirth>= today){
        alert("Please select a date before today.");
    }else if (!useRealAPI) {
        // Simulated account creation:
        console.log("Simulated account creation. Form data:", formData);
        alert("Account created successfully (simulation)! Check the console for details.");
    } else {
        // Real API call:
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
    }
});
