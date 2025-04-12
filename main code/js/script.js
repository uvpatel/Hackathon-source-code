// Chatbot functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const sendButton = document.querySelector('.chatbot-input button');
    const closeButton = document.querySelector('.close-chatbot');

    // Add initial bot message
    addMessage('Hello! I\'m your AI Career Advisor. How can I help you today?', 'bot');

    // Handle send button click
    sendButton.addEventListener('click', sendMessage);

    // Handle enter key press
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle close button click
    closeButton.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatbotInput.value = '';

            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Send message to backend
            fetch('/api/career-suggestions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    action: 'chat'
                })
            })
            .then(response => response.json())
            .then(data => {
                // Remove typing indicator
                chatbotMessages.removeChild(typingIndicator);

                if (data.success) {
                    addMessage(data.response, 'bot');
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }
            })
            .catch(error => {
                chatbotMessages.removeChild(typingIndicator);
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                console.error('Error:', error);
            });
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;
        
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}); 