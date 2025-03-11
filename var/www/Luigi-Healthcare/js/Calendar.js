document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");

    var calendar = new FullCalendar.Calendar(calendarEl, {
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

    calendar.render();

    function openNewPopup(date) {
        document.getElementById("appointment-popup").style.display = "block";
        document.getElementById("appointment-form").setAttribute("data-mode", "new");
        document.getElementById("appointment-date").value = date;
        document.getElementById("appointment-title").value = "";
        document.getElementById("appointment-time").value = "";
    }

    function openEditPopup(event) {
        document.getElementById("edit-appointment-popup").style.display = "block";
        document.getElementById("edit-appointment-title").value = event.title;
        document.getElementById("edit-appointment-date").value = event.startStr.split("T")[0];
        document.getElementById("edit-appointment-time").value = event.startStr.split("T")[1] || "";

        document.getElementById("save-edit-btn").onclick = function () {
            event.setProp("title", document.getElementById("edit-appointment-title").value);
            event.setStart(
                document.getElementById("edit-appointment-date").value +
                    "T" +
                    document.getElementById("edit-appointment-time").value
            );
            document.getElementById("edit-appointment-popup").style.display = "none";
        };

        document.getElementById("delete-btn").onclick = function () {
            if (confirm("Are you sure you want to delete this appointment?")) {
                event.remove();
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

    document.getElementById("appointment-form").addEventListener("submit", function (event) {
        event.preventDefault();
        var title = document.getElementById("appointment-title").value;
        var date = document.getElementById("appointment-date").value;
        var time = document.getElementById("appointment-time").value;

        if (!title || !date || !time) {
            alert("Please fill out all fields.");
            return;
        }

        var newAppointment = {
            title: title,
            start: date + "T" + time
        };

        calendar.addEvent(newAppointment);
        document.getElementById("appointment-popup").style.display = "none";
    });
});
