document.getElementById('dropdown-toggle').addEventListener('click', function() {
    document.getElementById('user-list').classList.toggle('hidden');
});


document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('message-who');
    if (!dropdown.contains(e.target)) {
        document.getElementById('user-list').classList.add('hidden');
    }
});

document.querySelectorAll('#user-list button').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('message-who').classList.add('hidden');
    });
});

document.querySelector('#message-sent-container button').addEventListener('click', function() {
    document.getElementById('message-sent-container').classList.add('hidden');
});

document.querySelector('#message-container button').addEventListener('click', function() {
    document.getElementById('message-container').classList.add('hidden');
    document.getElementById('message-who').classList.remove('hidden');
});

