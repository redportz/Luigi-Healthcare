import config from "./config.js";

const userId = localStorage.getItem("userId"); 

// Fetch user info for viewing and editing
async function fetchUserInfo() {
  try {
    const response = await fetch(`${config.API_ENDPOINTS.updateUserInfo}/${userId}`);
    const data = await response.json(); // Assuming the backend returns the user info


    // Populate text fields with read-only data (non-editable fields)
    document.getElementById("firstName").textContent = data.FirstName;
    document.getElementById("lastName").textContent = data.LastName;
    document.getElementById("dob").textContent = data.DateOfBirth;
    document.getElementById("email").textContent = data.Email;
    document.getElementById("licenseNumber").textContent = data.LicenseNumber || "N/A";
    document.getElementById("yearsOfExperience").textContent = data.YearsOfExperience || "N/A";
    document.getElementById("certifications").textContent = data.Certifications || "N/A";
    document.getElementById("specialty").textContent = data.Specialty || "N/A";
    
    // Populate editable fields (phone number and address)
    document.getElementById("phone").value = data.PhoneNumber || "N/A";
    document.getElementById("address").value = data.Address || "N/A";
    
    console.log(data); // Log the data for debugging
  } catch (err) {
    console.error("Failed to get user info:", err);
  }
}

// Update user info when form is submitted
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Prepare the updated user info (we only update phone and address in this case)
  const updatedUser = {
    PhoneNumber: document.getElementById("phone").value,
    Address: document.getElementById("address").value,
  };

  console.log(updatedUser); // Log updated user data for debugging

  try {
    // PUT request to update the user info (phone and address)
    const response = await fetch(`${config.API_ENDPOINTS.updateUserInfo}/${userId}?currentUserId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      alert("Info updated successfully!");
    } else {
      alert("Failed to update info.");
    }
  } catch (err) {
    console.error("Update failed:", err);
  }
});

// Call the function to load the user info when the page loads
window.onload = fetchUserInfo;
