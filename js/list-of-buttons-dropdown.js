// document.getElementById('dropdown-toggle').addEventListener('click', function() {
//     document.getElementById('user-list').classList.toggle('hidden');
// });


// document.addEventListener('click', function(e) {
//     const dropdown = document.getElementById('message-who');
//     if (!dropdown.contains(e.target)) {
//         document.getElementById('user-list').classList.add('hidden');
//     }
// });

// document.querySelectorAll('#user-list button').forEach(button => {
//     button.addEventListener('click', function() {
//         document.getElementById('message-who').classList.add('hidden');
//         document.getElementById('messages-box').classList.toggle('hidden');
        
//     });
// });

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('already-on-page-pop-up_btn').addEventListener('click', function() {

        document.getElementById('already-on-page-pop-up').classList.toggle('hidden');
    });
});
