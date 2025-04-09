import config from "./config.js";


async function fetchDoctors(userId) {
    try {
        const response = await fetch(`${config.API_ENDPOINTS.message_buttons}?currentUserId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch users');

        const users = await response.json();
        return users.filter(user => user.userId !== userId && user.role === "Doctor");
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
}

document.addEventListener("DOMContentLoaded", async function () {
  
    const userId = parseInt(localStorage.getItem("userId")) || 1;
    
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        selectable: true,
        editable: true,
        eventClick: function (info) {
            openEditPopup(info.event);
        },
        dateClick: function (info) {
            openNewPopup(info.dateStr);
        }
    });

    
    const doctors = await fetchDoctors(userId);

    // Load user's appointments
    try {
        const res = await fetch(`${config.API_ENDPOINTS.getPatientAppointments}/${userId}`);
        if (res.ok) {
            const appointments = await res.json();
            console.log("Patient's Appointments:", appointments);
            
          
            appointments.forEach(appointment => {
                calendar.addEvent({
                    id: appointment.appointmentId,
                    title: appointment.reason || "No title",
                    start: appointment.appointmentDate
                });
            });
        } else {
            console.error("Failed to fetch appointments");
        }
    } catch (error) {
        console.error("Error loading appointments:", error);
    }

    calendar.render();

    function openNewPopup(date) {
        document.getElementById("appointment-popup").style.display = "block";
        document.getElementById("appointment-form").setAttribute("data-mode", "new");
        document.getElementById("appointment-date").value = date;
        document.getElementById("appointment-title").value = "";
        document.getElementById("appointment-time").value = "";
        
        
        const doctorSelect = document.getElementById("appointment-doctor");
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
            
            doctors.forEach(doctor => {
                const option = document.createElement("option");
                option.value = doctor.userId;
                
                
                if (doctor.specialty) {
                    option.textContent = `${doctor.firstName} ${doctor.lastName} (${doctor.specialty})`;
                } else {
                    option.textContent = `${doctor.firstName} ${doctor.lastName}`;
                }
                
                doctorSelect.appendChild(option);
            });
        }
    }

    function openEditPopup(event) {
        document.getElementById("edit-appointment-popup").style.display = "block";
        document.getElementById("edit-appointment-title").value = event.title;
        document.getElementById("edit-appointment-date").value = event.startStr.split("T")[0];
        document.getElementById("edit-appointment-time").value = event.startStr.split("T")[1] || "";
        
       
        document.getElementById("edit-appointment-popup").setAttribute("data-appointment-id", event.id);

        document.getElementById("save-edit-btn").onclick = async function () {
            const appointmentId = document.getElementById("edit-appointment-popup").getAttribute("data-appointment-id");
            const title = document.getElementById("edit-appointment-title").value;
            const date = document.getElementById("edit-appointment-date").value;
            const time = document.getElementById("edit-appointment-time").value;
            
            event.setProp("title", title);
            event.setStart(date + "T" + time);
            
            
            
            document.getElementById("edit-appointment-popup").style.display = "none";
        };

        document.getElementById("delete-btn").onclick = async function () {
            if (confirm("Are you sure you want to delete this appointment?")) {
                const appointmentId = document.getElementById("edit-appointment-popup").getAttribute("data-appointment-id");
                
                try {
                    const res = await fetch(`${config.API_ENDPOINTS.adminAppointments}/${appointmentId}`, {
                        method: "DELETE"
                    });
                    
                    if (res.ok) {
                        console.log(`Appointment ${appointmentId} deleted.`);
                        event.remove();
                    } else {
                        console.error(`Failed to delete appointment ${appointmentId}`);
                        alert("Failed to delete appointment. Please try again.");
                    }
                } catch (error) {
                    console.error("Error deleting appointment:", error);
                    alert("An error occurred while deleting the appointment.");
                }
                
                document.getElementById("edit-appointment-popup").style.display = "none";
            }
        };
    }

    document.querySelectorAll(".close-popup").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.getElementById("appointment-popup").style.display = "none";
            document.getElementById("edit-appointment-popup").style.display = "none";
        });
    });

    document.getElementById("appointment-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const title = document.getElementById("appointment-title").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;
        
        const doctorSelect = document.getElementById("appointment-doctor");
        let doctorId;
        
        if (doctorSelect) {
            doctorId = parseInt(doctorSelect.value);
            if (!doctorId) {
                alert("Please select a doctor.");
                return;
            }
        } else {
           
            doctorId = userId;
        }
        
        if (!title || !date || !time) {
            alert("Please fill out all fields.");
            return;
        }

        
        const appointmentData = {
            appointmentDate: `${date}T${time}:00`,
            reason: title,
            patientId: userId,
            doctorId: doctorId
        };

        try {
            const res = await fetch(`${config.API_ENDPOINTS.adminAppointments}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                throw new Error("Failed to create appointment");
            }
            
            const data = await res.json();
            console.log("Appointment created:", data);
            
            
            calendar.addEvent({
                id: data.appointmentId,
                title: appointmentData.reason,
                start: appointmentData.appointmentDate
            });
            
            document.getElementById("appointment-popup").style.display = "none";
            
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("An error occurred while creating the appointment. Please try again.");
        }
    });
});