import config from "./config.js";

const userId = localStorage.getItem("userId");

// Fetch prescriptions for a specific patient
function fetchPrescriptions() {
    const patientId = document.getElementById("patientId").value;

    fetch(`${config.API_ENDPOINTS.prescriptions}?userId=${patientId}`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("prescriptions-list");
            list.innerHTML = "";
console.log(data);

            data.prescriptions.forEach(prescription => {
                list.innerHTML += `
                    <div class="prescription-item">
                        <h3>${prescription.name}</h3>
                        <p>Dosage: ${prescription.dosage}</p>
                        <p>Refills Left: ${prescription.refills}</p>
                        <p>Strength (mg): ${prescription.milligrams}<p>
                        <p>Frequency: ${prescription.frequency}<p>
                        <p>Reason: ${prescription.reason}<p>
                        <button onclick="editPrescription(${prescription.id})">Edit</button>
                        <button onclick="deletePrescription(${prescription.id})">Delete</button>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error loading prescriptions:", error));
}

window.fetchPrescriptions= fetchPrescriptions;

// Populate the form with prescription data for editing
function editPrescription(id) {
    fetch(`${config.API_ENDPOINTS.prescriptions}/${id}`)
        .then(response => response.json())
        .then(prescription => {
            document.getElementById("prescriptionId").value = prescription.id;
            document.getElementById("name").value = prescription.name;
            document.getElementById("dosage").value = prescription.dosage;
            document.getElementById("frequency").value = prescription.frequency;
            document.getElementById("milligrams").value = prescription.milligrams;
            document.getElementById("refills").value = prescription.refills;
            document.getElementById("doctor").value = prescription.doctor;
            document.getElementById("phone").value = prescription.phone;
            document.getElementById("reason").value = prescription.reason;
        });
}

window.editPrescription= editPrescription;

// Handle form submission (Add or Update)
document.getElementById("prescription-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const prescriptionId = document.getElementById("prescriptionId").value;
    const method = prescriptionId ? "PUT" : "POST";
    const endpoint = prescriptionId
        ? `${config.API_ENDPOINTS.prescriptions}/${prescriptionId}?userId=${userId}`
        : `${config.API_ENDPOINTS.prescriptions}?userId=${userId}`;

    const prescriptionData = {
        userId: document.getElementById("patientId").value,
        name: document.getElementById("name").value,
        dosage: document.getElementById("dosage").value,
        frequency: document.getElementById("frequency").value,
        milligrams: document.getElementById("milligrams").value,
        refills: document.getElementById("refills").value,
        doctor: document.getElementById("doctor").value,
        phone: document.getElementById("phone").value,
        reason: document.getElementById("reason").value
    };

    fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData)
    })
    .then(() => fetchPrescriptions());
});

// Delete a prescription
function deletePrescription(id) {
    fetch(`${config.API_ENDPOINTS.prescriptions}/${id}?userId=${userId}`, {
        method: "DELETE"
    })
    .then(() => fetchPrescriptions());
}
