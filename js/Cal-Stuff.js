import config from "./config.js";

// const userId = localStorage.getItem("userId");
const userId = 1

async function getAppointmentsByPatient(patientId) {
    const res = await fetch(`${config.API_ENDPOINTS.getPatientAppointments}/${patientId}`);
    const data = await res.json();
    console.log("Patient's Appointments:", data);
  }
  window.getAppointmentsByPatient= getAppointmentsByPatient;


  async function deleteAppointment(id) {
    const res = await fetch(`${config.API_ENDPOINTS.adminAppointments}/${id}`, {
      method: "DELETE"
    });
  
    if (res.ok) {
      console.log(`Appointment ${id} deleted.`);
    } else {
      console.log(`Failed to delete appointment ${id}`);
    }
  }
  
  window.deleteAppointment= deleteAppointment;


  async function createAppointment(appointment) {
    const res = await fetch(`${config.API_ENDPOINTS.adminAppointments}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });
  
    const data = await res.json();
    console.log("Appointment created:", data);
  }
  
  
  async function fetchDoctors() {
    try {
        const response = await fetch(`${config.API_ENDPOINTS.message_buttons}?currentUserId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch users');

        const users = await response.json();

        // const PatientList = document.getElementById('Patient-list');

        const userList = document.getElementById('user-list'); // Ensure there's a <ul id="userList"> in HTML

        console.log(users);
        
        users.forEach(user => {
          if (user.userId !== userId && user.role === "Doctor") {
              const listItem = document.createElement('li');
              const button = document.createElement('button');

              if (user.role === "Doctor" && user.specialty) {
                  button.textContent = `${user.firstName} ${user.lastName} (${user.role} - ${user.specialty})`;
              } 
              
              button.setAttribute('onclick', `selectChatPartner(${user.userId})`);

              listItem.appendChild(button);
              userList.appendChild(listItem);
          }
      });





      }
    catch{

    }
  }
  window.fetchDoctors=fetchDoctors



  document.getElementById('dropdown-toggle').addEventListener('click', function () {
    document.getElementById('user-list').classList.toggle('hidden');
});
  
  window.onload = () => {
    getAppointmentsByPatient(userId);
    fetchDoctors()
  };