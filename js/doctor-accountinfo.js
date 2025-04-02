import config from "./config.js";

const userId = localStorage.getItem("userId"); 

// fetch user info from backend for view/edit
async function fetchDoctorInfo() {
  try {
    const response = await fetch(`${config.API_ENDPOINTS.getUserInfo}/${userId}`);
    const data = await response.json(); 

    const formattedDate = new Date(data.dateOfBirth).toLocaleDateString("en-US");

    
    const phonenumber=document.getElementById("phone")
    const homeAddress=document.getElementById("address")

    const certs=document.getElementById("certifications")
    const yrs=document.getElementById("yearsOfExperience")
    const licenseNum=document.getElementById("licenseNumber")
    const special=document.getElementById("licenseNumber")

    // Populate text fields with read-only data (non-editable fields)
    document.getElementById("firstName").textContent = data.firstName;
    document.getElementById("lastName").textContent = data.lastName;
    document.getElementById("email").textContent = data.email;

    // document.getElementById("dob").textContent = data.dateOfBirth;
    document.getElementById("dob").textContent = formattedDate;

    licenseNum.textContent = data.doctorDetails.licenseNumber || "N/A";
    yrs.textContent = data.doctorDetails.yearsOfExperience || "N/A";
    certs.textContent = data.doctorDetails.certifications || "N/A";
    special.textContent = data.doctorDetails.specialty || "N/A";
  
    // Populate editable fields (phone number and address)
    phonenumber.value = data.phoneNumber || "N/A";
    homeAddress.value = data.address || "N/A";


  } catch (err) {
    console.error("Failed to get user info:", err);
  }
}

// update user info when form is submitted
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // prepare the updated user info 
  const updatedUser = {
    PhoneNumber: document.getElementById("phone").value,
    Address: document.getElementById("address").value,
  };


  try {
    // PUT request for updating doctor info for phone number and address

    const response = await fetch(`${config.API_ENDPOINTS.updateDoctorInfo}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      
      
      body: JSON.stringify(updatedUser),
    });
    console.log(updatedUser);
    

    if (response.ok) {
      alert("Info updated successfully!");
    } else {
      alert("Failed to update info.");
    }
  } catch (err) {
    console.error("Update failed:", err);
  }
});

// call function to load the user info when the page loads
window.onload = fetchDoctorInfo;