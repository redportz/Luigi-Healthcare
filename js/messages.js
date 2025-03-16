const userId = parseInt(localStorage.getItem("userId")); // ✅ Ensure userId is a number

if (!userId) {
    alert("User not logged in!");
    window.location.href = "login.html"; // Redirect to login if no user ID found
}

let chatWithUserId = null; // User that we are chatting with
let pageNumber = 1;
const pageSize = 10;
const apiBaseUrl = "http://localhost:5115/api/messages";
const displayedMessageIds = new Set(); // ✅ Prevent duplicate messages

// ✅ Load messages between logged-in user and selected chat partner
async function loadMessages() {
    if (!chatWithUserId) {
        alert("Please select a chat partner first!");
        return;
    }

    try {
        console.log(`📩 Fetching messages between user ${userId} and ${chatWithUserId}, page ${pageNumber}`);

        const response = await fetch(`${apiBaseUrl}/chat/${userId}/${chatWithUserId}/${pageNumber}/${pageSize}`);
        const messages = await response.json();

        if (messages.length === 0) {
            console.warn("No new messages found.");
            if (pageNumber === 1) {
                document.getElementById("message-list").innerHTML = "<p>No messages yet.</p>";
            }
            document.getElementById("load-more").style.display = "none";
            return;
        }

        displayMessages(messages);
        pageNumber++; // ✅ Load next page on button click

        // ✅ Hide "Load More" if we get fewer messages than pageSize
        if (messages.length < pageSize) {
            document.getElementById("load-more").style.display = "none";
        }
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

// ✅ Display messages in the list
function displayMessages(messages) {
    const messageList = document.getElementById("message-list");

    messages.forEach(msg => {
        if (!displayedMessageIds.has(msg.messageId)) { // ✅ Prevent duplicates
            displayedMessageIds.add(msg.messageId);

            const listItem = document.createElement("li");
            listItem.textContent = `[${msg.sentAt}] From ${msg.senderId}: ${msg.messageText}`;
            messageList.appendChild(listItem);
        }
    });

    // ✅ Scroll to bottom for the newest message
    messageList.scrollTop = messageList.scrollHeight;
}

// ✅ Set chat partner and load messages
function selectChatPartner(otherUserId) {
    chatWithUserId = otherUserId;
    pageNumber = 1; // Reset page number for new conversation
    displayedMessageIds.clear(); // Clear previous messages
    document.getElementById("message-list").innerHTML = ""; // Clear UI
    loadMessages();
}

// ✅ Send a message
document.getElementById("send-message-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page refresh

    if (!chatWithUserId) {
        alert("Please select a chat partner first!");
        return;
    }

    const messageText = document.getElementById("message-text").value;

    if (!messageText) {
        alert("Please enter a message.");
        return;
    }

    const messageData = {
        senderId: userId,  // ✅ Use logged-in user's ID
        receiverId: chatWithUserId,
        messageText: messageText
    };

    try {
        const response = await fetch(`${apiBaseUrl}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageData)
        });

        if (response.ok) {
            alert("Message sent!");
            document.getElementById("message-text").value = ""; // ✅ Clear input
            loadMessages(); // ✅ Reload messages after sending
        } else {
            alert("Error sending message.");
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

// ✅ Load more messages when button is clicked
document.getElementById("load-more").addEventListener("click", loadMessages);
