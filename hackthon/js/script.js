document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Load profile data
    async function loadProfile() {
        try {
            const response = await fetch('api/profile.php', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load profile');
            }

            const data = await response.json();
            displayProfile(data.profile, data.skills);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // Display profile data
    function displayProfile(profile, skills) {
        const profileSummary = document.getElementById('profileSummary');
        
        let html = `
            <div class="space-y-2">
                <p class="text-sm text-gray-500">Full Name</p>
                <p class="text-sm font-medium text-gray-900">${profile.full_name || 'Not set'}</p>
            </div>
            <div class="space-y-2">
                <p class="text-sm text-gray-500">Education Level</p>
                <p class="text-sm font-medium text-gray-900">${profile.education_level || 'Not set'}</p>
            </div>
            <div class="space-y-2">
                <p class="text-sm text-gray-500">Current Occupation</p>
                <p class="text-sm font-medium text-gray-900">${profile.current_occupation || 'Not set'}</p>
            </div>
            <div class="space-y-2">
                <p class="text-sm text-gray-500">Years of Experience</p>
                <p class="text-sm font-medium text-gray-900">${profile.years_experience || 'Not set'}</p>
            </div>
            <div class="space-y-2">
                <p class="text-sm text-gray-500">Top Skills</p>
                <div class="flex flex-wrap gap-2">
                    ${skills.slice(0, 5).map(skill => `
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            ${skill.name} (${skill.proficiency_level}/5)
                        </span>
                    `).join('')}
                </div>
            </div>
        `;

        profileSummary.innerHTML = html;
    }

    // Load chat history
    async function loadChatHistory() {
        try {
            const response = await fetch('api/career-suggestions.php', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load chat history');
            }

            const data = await response.json();
            displayChatHistory(data.chat_history);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    // Display chat history
    function displayChatHistory(chatHistory) {
        const chatMessages = document.getElementById('chatMessages');
        
        let html = '';
        chatHistory.forEach(message => {
            const isUser = message.is_user;
            html += `
                <div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'}">
                        ${message.message}
                    </div>
                </div>
            `;
        });

        chatMessages.innerHTML = html;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle chat form submission
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (!message) return;

            // Add user message to chat
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML += `
                <div class="flex justify-end">
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-indigo-600 text-white">
                        ${message}
                    </div>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Clear input
            messageInput.value = '';

            try {
                const response = await fetch('api/career-suggestions.php', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) {
                    throw new Error('Failed to get response');
                }

                const data = await response.json();

                // Add AI response to chat
                chatMessages.innerHTML += `
                    <div class="flex justify-start">
                        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
                            ${data.suggestion}
                        </div>
                    </div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while getting the response');
            }
        });
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // Initial load
    loadProfile();
    loadChatHistory();
}); 