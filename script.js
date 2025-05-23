// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbo1EsOSfr_VgyNv3yc9ZMBrqw_OCb38Q",
  authDomain: "bihan-b2d7e.firebaseapp.com",
  projectId: "bihan-b2d7e",
  storageBucket: "bihan-b2d7e.firebasestorage.app",
  messagingSenderId: "1062687694186",
  appId: "1:1062687694186:web:c65011907927b25efa5913",
  measurementId: "G-3YDZKCY70W"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const authMessage = document.getElementById('auth-message');
const logoutBtn = document.getElementById('logout-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const currentRoomDisplay = document.getElementById('current-room');
const userNameDisplay = document.getElementById('user-name');
const rooms = document.querySelectorAll('.room');

// Current room
let currentRoom = 'general';

// Check auth state
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        authContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        userNameDisplay.textContent = user.email.split('@')[0];
        loadMessages();
    } else {
        // User is signed out
        authContainer.style.display = 'flex';
        chatContainer.style.display = 'none';
    }
});

// Login function
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            authMessage.textContent = '';
        })
        .catch(error => {
            authMessage.textContent = error.message;
        });
});

// Signup function
signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            authMessage.textContent = '';
        })
        .catch(error => {
            authMessage.textContent = error.message;
        });
});

// Logout function
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    db.collection('rooms').doc(currentRoom).collection('messages').add({
        text: message,
        sender: user.email,
        senderName: user.email.split('@')[0],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        messageInput.value = '';
    })
    .catch(error => {
        console.error('Error sending message: ', error);
    });
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Load messages function
function loadMessages() {
    messagesContainer.innerHTML = '';
    
    db.collection('rooms').doc(currentRoom).collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    displayMessage(change.doc.data());
                }
            });
        });
}

// Display message function
function displayMessage(message) {
    const user = auth.currentUser;
    const isSent = message.sender === user.email;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isSent ? 'sent' : 'received');
    
    messageElement.innerHTML = `
        ${!isSent ? `<div class="message-sender">${message.senderName}</div>` : ''}
        <div class="message-content">${message.text}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Change room function
rooms.forEach(room => {
    room.addEventListener('click', () => {
        // Remove active class from all rooms
        rooms.forEach(r => r.classList.remove('active'));
        // Add active class to clicked room
        room.classList.add('active');
        // Update current room
        currentRoom = room.dataset.room;
        currentRoomDisplay.textContent = currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1);
        // Load messages for new room
        loadMessages();
    });
});
