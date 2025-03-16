import config from "./config.js";

const userId = parseInt(localStorage.getItem("userId")); // Get logged-in user ID

//second check if logged in
if (!userId) {
    alert("User not logged in!");
    window.location.href = "login.html"; 
}

let chatWithUserId = null; // Who the user is chatting with
let pageNumber = 1;
const pageSize = 10;
const apiBaseUrl = config.API_ENDPOINTS.messages; 

const displayedMessageIds = new Set(); // Prevent duplicate messages

//  Function to select a chat partner
export function selectChatPartner(otherUserId) {
    chatWithUserId = otherUserId;
    pageNumber = 1; // Reset pagination
    displayedMessageIds.clear();
    document.getElementById("message-list").innerHTML = ""; // Clear messages
    loadMessages();
}

// ✅ Load messages between the selected user and logged-in user
async function loadMessages() {
    if (!chatWithUserId) {
        alert("Please select a chat partner first!");
        return;
    }

    try {
        console.log(`📩 Fetching messages between user ${userId} and ${chatWithUserId}, page ${pageNumber}`);

        const response = await fetch(`${apiBaseUrl}chat/${userId}/${chatWithUserId}/${pageNumber}/${pageSize}`);
        const messages = await response.json();

        if (messages.length === 0) {
            document.getElementById("load-more").style.display = "none";
            return;
        }

        displayMessages(messages);
        pageNumber++;
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

// ✅ Display messages
function displayMessages(messages) {
    const messageList = document.getElementById("message-list");

    messages.forEach(msg => {
        if (!displayedMessageIds.has(msg.messageId)) {
            displayedMessageIds.add(msg.messageId);

            const listItem = document.createElement("li");
            listItem.textContent = `[${msg.sentAt}] From ${msg.senderId}: ${msg.messageText}`;
            messageList.appendChild(listItem);
        }
    });

    messageList.scrollTop = messageList.scrollHeight; // Scroll to bottom
}

// ✅ Expose functions for debugging in the browser console (optional)
window.selectChatPartner = selectChatPartner;
window.loadMessages = loadMessages;
