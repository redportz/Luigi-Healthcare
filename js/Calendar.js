import config from "./config.js";

// Get user ID from localStorage - similarly to how drPrescriptions.js does it
const userId = parseInt(localStorage.getItem("userId")) || 1;

// Function to fetch doctors for dropdown - similar to fetchPrescriptions()
async function fetchDoctors() {
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
window.fetchDoctors = fetchDoctors;

// Function to get appointments - similar pattern to fetchPrescriptions()
async function getAppointmentsByPatient(patientId) {
    try {
        const res = await fetch(`${config.API_ENDPOINTS.getPatientAppointments}/${patientId}`);
        if (!res.ok) {
            console.error("Failed to fetch appointments");
            return [];
        }
        const appointments = await res.json();
        console.log("Patient's Appointments:", appointments);
        return appointments;
    } catch (error) {
        console.error("Error loading appointments:", error);
        return [];
    }
}
window.getAppointmentsByPatient = getAppointmentsByPatient;

// Function to delete appointment - similar to deletePrescription()
async function deleteAppointment(appointmentId) {
    try {
        const res = await fetch(`${config.API_ENDPOINTS.adminAppointments}/${appointmentId}`, {
            method: "DELETE"
        });
        
        if (res.ok) {
            console.log(`Appointment ${appointmentId} deleted.`);
            return true;
        } else {
            console.error(`Failed to delete appointment ${appointmentId}`);
            return false;
        }
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return false;
    }
}
window.deleteAppointment = deleteAppointment;

// Function to create appointment - similar to prescription form submission
async function createAppointment(appointmentData) {
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
        return data;
    } catch (error) {
        console.error("Error creating appointment:", error);
        return null;
    }
}
window.createAppointment = createAppointment;

document.addEventListener("DOMContentLoaded", async function () {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) {
        console.error("Calendar element not found");
        return;
    }

    // Create calendar instance
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

    // Fetch doctors for the dropdown - similar to drPrescriptions approach
    const doctors = await fetchDoctors();

    // Load appointments - similar pattern as fetchPrescriptions()
    const appointments = await getAppointmentsByPatient(userId);
    
    // Add appointments to calendar
    if (appointments && appointments.length > 0) {
        appointments.forEach(appointment => {
            calendar.addEvent({
                id: appointment.appointmentId,
                title: appointment.reason || "No title",
                start: appointment.appointmentDate
            });
        });
    }

    calendar.render();

    function openNewPopup(date) {
        document.getElementById("appointment-popup").style.display = "block";
        document.getElementById("appointment-form").setAttribute("data-mode", "new");
        document.getElementById("appointment-date").value = date;
        document.getElementById("appointment-title").value = "";
        document.getElementById("appointment-time").value = "";
        
        // Populate doctor dropdown - similar to how options are added in drPrescriptions
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
        
        // Handle time value more carefully
        let timeValue = "";
        if (event.startStr.includes("T")) {
            timeValue = event.startStr.split("T")[1];
            if (timeValue.includes("+") || timeValue.includes("Z")) {
                timeValue = timeValue.split("+")[0].split("Z")[0];
            }
            timeValue = timeValue.substring(0, 5); // Get HH:MM format
        }
        
        document.getElementById("edit-appointment-time").value = timeValue;
        
        // Store the event ID on the popup - similar pattern to how prescriptionId is stored
        document.getElementById("edit-appointment-popup").setAttribute("data-appointment-id", event.id);

        // Edit button handler - similar to edit prescription
        document.getElementById("save-edit-btn").onclick = async function () {
            const appointmentId = document.getElementById("edit-appointment-popup").getAttribute("data-appointment-id");
            const title = document.getElementById("edit-appointment-title").value;
            const date = document.getElementById("edit-appointment-date").value;
            const time = document.getElementById("edit-appointment-time").value;
            
            // Update UI first
            event.setProp("title", title);
            event.setStart(date + "T" + time);
            
            // TODO: Add API call to update appointment on backend
            // Similar to how prescription updates work
            
            document.getElementById("edit-appointment-popup").style.display = "none";
        };

        // Delete button handler - uses the extracted deleteAppointment function
        document.getElementById("delete-btn").onclick = async function () {
            if (confirm("Are you sure you want to delete this appointment?")) {
                const appointmentId = document.getElementById("edit-appointment-popup").getAttribute("data-appointment-id");
                
                const success = await deleteAppointment(appointmentId);
                if (success) {
                    event.remove();
                    document.getElementById("edit-appointment-popup").style.display = "none";
                } else {
                    alert("Failed to delete appointment. Please try again.");
                }
            }
        };
    }

    // Close popup handlers
    document.querySelectorAll(".close-popup").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.getElementById("appointment-popup").style.display = "none";
            document.getElementById("edit-appointment-popup").style.display = "none";
        });
    });

    // Form submission - similar pattern to prescription form submission
    document.getElementById("appointment-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const title = document.getElementById("appointment-title").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;
        
        // Handle doctor selection - get value from dropdown if it exists
        const doctorSelect = document.getElementById("appointment-doctor");
        let doctorId;
        
        if (doctorSelect) {
            doctorId = parseInt(doctorSelect.value);
            if (!doctorId) {
                alert("Please select a doctor.");
                return;
            }
        } else {
            // If we're in the doctor's dashboard, the doctor is the current user
            doctorId = userId;
        }
        
        if (!title || !date || !time) {
            alert("Please fill out all fields.");
            return;
        }

        // Format data for backend - follows the model structure like in prescriptionData
        const appointmentData = {
            appointmentDate: `${date}T${time}:00`,
            reason: title,
            patientId: userId,
            doctorId: doctorId
        };

        // Use the extracted createAppointment function
        const savedAppointment = await createAppointment(appointmentData);
        
        if (savedAppointment && savedAppointment.appointmentId) {
            // Add to calendar
            calendar.addEvent({
                id: savedAppointment.appointmentId,
                title: savedAppointment.reason,
                start: savedAppointment.appointmentDate
            });
            
            document.getElementById("appointment-popup").style.display = "none";
        } else {
            alert("Failed to save appointment. Please try again.");
        }
    });
});