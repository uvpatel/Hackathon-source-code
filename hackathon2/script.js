// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation & UI Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.querySelector('.login-btn a');
    const signupBtn = document.querySelector('.signup-btn a');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const showSignup = document.querySelector('.show-signup');
    const showLogin = document.querySelector('.show-login');
    const getStartedBtn = document.getElementById('get-started-btn');
    
    // Skill Assessment Elements
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillForms = document.querySelectorAll('.skill-form');
    
    // Chatbot Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatbotBody = document.querySelector('.chatbot-body');
    
    // Initialize Chatbot
    initChatbot();
    
    // Mobile Navigation Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Modal Controls
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'block';
        });
    }
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            const skillsSection = document.getElementById('skills');
            if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });
    
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
    
    // Skills Assessment Navigation
    skillCategories.forEach(category => {
        category.addEventListener('click', () => {
            const targetCategory = category.getAttribute('data-category');
            
            skillCategories.forEach(c => c.classList.remove('active'));
            skillForms.forEach(form => form.classList.remove('active'));
            
            category.classList.add('active');
            document.getElementById(`${targetCategory}-skills-form`).classList.add('active');
        });
    });
    
    // Form Submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Process login - for demo purposes just close modal
            loginModal.style.display = 'none';
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Process signup - for demo purposes just close modal
            signupModal.style.display = 'none';
        });
    }

    // Chatbot Functions
    function initChatbot() {
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', () => {
                chatbotContainer.classList.toggle('open');
                
                // Toggle icon between up and down
                if (chatbotContainer.classList.contains('open')) {
                    chatbotToggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
                } else {
                    chatbotToggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
                }
            });
        }

        if (sendBtn && chatbotInput) {
            // Send message on button click
            sendBtn.addEventListener('click', sendMessage);
            
            // Send message on Enter key
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Show loading indicator
        const loadingMessage = addMessageToChat("Thinking...", 'bot');
        
        // Make API call to backend
        fetch('backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading message
            loadingMessage.remove();
            
            if (data.success) {
                // Add bot response to chat
                addMessageToChat(data.response, 'bot');
            } else {
                // Handle error
                addMessageToChat("Sorry, I encountered an error. Please try again later.", 'bot');
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            // Remove loading message
            loadingMessage.remove();
            
            // Handle error
            addMessageToChat("Sorry, I encountered an error. Please try again later.", 'bot');
            console.error('Error:', error);
        });
    }

    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatbotBody.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function processUserMessage(message) {
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Show loading indicator
        const loadingMessage = addMessageToChat("Thinking...", 'bot');
        
        // Make API call to backend
        fetch('backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading message
            loadingMessage.remove();
            
            if (data.success) {
                // Add bot response to chat
                addMessageToChat(data.response, 'bot');
            } else {
                // Handle error
                addMessageToChat("Sorry, I encountered an error. Please try again later.", 'bot');
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            // Remove loading message
            loadingMessage.remove();
            
            // Handle error
            addMessageToChat("Sorry, I encountered an error. Please try again later.", 'bot');
            console.error('Error:', error);
        });
    }

    // Skill Assessment in Chatbot
    function startSkillAssessment() {
        const questions = [
            {
                question: "How would you rate your programming skills? (1-5)",
                type: "rating",
                category: "technical"
            },
            {
                question: "How would you rate your data analysis skills? (1-5)",
                type: "rating",
                category: "technical"
            },
            {
                question: "How would you rate your communication skills? (1-5)",
                type: "rating",
                category: "soft"
            },
            {
                question: "How would you rate your teamwork abilities? (1-5)",
                type: "rating",
                category: "soft"
            },
            {
                question: "What industry are you most interested in working in?",
                type: "text",
                category: "interest"
            }
        ];

        // Add the first question to the chat
        askSkillQuestion(0, questions, {});
    }

    function askSkillQuestion(index, questions, answers) {
        if (index >= questions.length) {
            // All questions answered, provide assessment results
            provideAssessmentResults(answers);
            return;
        }

        const question = questions[index];
        addMessageToChat(question.question, 'bot');

        if (question.type === "rating") {
            // Add rating UI
            const ratingUI = document.createElement('div');
            ratingUI.classList.add('chat-rating-ui');
            
            for (let i = 1; i <= 5; i++) {
                const ratingBtn = document.createElement('button');
                ratingBtn.classList.add('rating-btn');
                ratingBtn.textContent = i;
                ratingBtn.addEventListener('click', function() {
                    // Record answer
                    answers[question.category + '-' + index] = i;
                    
                    // Remove the rating UI
                    ratingUI.remove();
                    
                    // Show user's selection
                    addMessageToChat(i.toString(), 'user');
                    
                    // Ask next question
                    setTimeout(() => {
                        askSkillQuestion(index + 1, questions, answers);
                    }, 700);
                });
                ratingUI.appendChild(ratingBtn);
            }
            
            chatbotBody.appendChild(ratingUI);
        } else {
            // For text questions, we'll use the regular input
            const originalSendFunction = sendBtn.onclick;
            
            const handleTextAnswer = function() {
                const message = chatbotInput.value.trim();
                if (message === '') return;
                
                // Record answer
                answers[question.category + '-' + index] = message;
                
                // Clear input
                chatbotInput.value = '';
                
                // Add user message to chat
                addMessageToChat(message, 'user');
                
                // Restore original send function
                sendBtn.onclick = originalSendFunction;
                chatbotInput.removeEventListener('keypress', handleKeyPress);
                
                // Ask next question
                setTimeout(() => {
                    askSkillQuestion(index + 1, questions, answers);
                }, 700);
            };
            
            const handleKeyPress = function(e) {
                if (e.key === 'Enter') {
                    handleTextAnswer();
                }
            };
            
            // Override send button temporarily
            sendBtn.onclick = handleTextAnswer;
            chatbotInput.addEventListener('keypress', handleKeyPress);
        }
        
        // Scroll to bottom
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function provideAssessmentResults(answers) {
        // Calculate technical skills average
        let technicalSum = 0;
        let technicalCount = 0;
        
        // Calculate soft skills average
        let softSum = 0;
        let softCount = 0;
        
        for (const key in answers) {
            if (key.startsWith('technical-')) {
                technicalSum += parseInt(answers[key]);
                technicalCount++;
            } else if (key.startsWith('soft-')) {
                softSum += parseInt(answers[key]);
                softCount++;
            }
        }
        
        const technicalAvg = technicalCount > 0 ? technicalSum / technicalCount : 0;
        const softAvg = softCount > 0 ? softSum / softCount : 0;
        
        // Get interest
        const interest = answers['interest-4'] || "technology";
        
        // Prepare user data for backend
        const userData = {
            skills: `Technical: ${technicalAvg.toFixed(1)}/5, Soft: ${softAvg.toFixed(1)}/5`,
            interests: interest,
            experience: "Entry level", // Default value, could be determined by more questions
            education: "Bachelor's degree", // Default value, could be determined by more questions
            location: "Remote" // Default value, could be determined by more questions
        };
        
        // Let user know we're processing
        addMessageToChat("Analyzing your skills and preferences...", 'bot');
        
        // Check if we should use advanced backend or provide simple response
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // On a real server, use the backend
            getAdvancedCareerAdvice(userData);
        } else {
            // Provide simple response for local development
            provideSimpleAdvice(technicalAvg, softAvg, interest);
        }
    }
    
    function provideSimpleAdvice(technicalAvg, softAvg, interest) {
        // Provide assessment results
        let resultMessage = "Based on your responses, here's my assessment:\n\n";
        resultMessage += `Technical Skills: ${technicalAvg.toFixed(1)}/5\n`;
        resultMessage += `Soft Skills: ${softAvg.toFixed(1)}/5\n\n`;
        
        // Career suggestions based on scores
        resultMessage += "Career Suggestions:\n";
        
        if (technicalAvg >= 4 && softAvg >= 3) {
            resultMessage += "1. Technical Lead or Project Manager - Your strong technical and people skills make you a good fit for leadership roles.\n";
            resultMessage += "2. Solutions Architect - Your technical expertise and communication skills would be valuable in designing solutions for clients.\n";
        } 
        else if (technicalAvg >= 4) {
            resultMessage += "1. Software Developer or Engineer - Your strong technical skills are perfect for development roles.\n";
            resultMessage += "2. Data Scientist - Your technical aptitude would serve you well in handling data analysis.\n";
        }
        else if (softAvg >= 4) {
            resultMessage += "1. Project Manager or Product Owner - Your people skills are excellent for coordinating teams.\n";
            resultMessage += "2. Customer Success Manager - Your communication skills would be valuable in client-facing roles.\n";
        }
        else {
            resultMessage += "1. Junior Developer or Analyst - A great starting point to build your technical and soft skills.\n";
            resultMessage += "2. Technical Support - Help provide solutions while developing your skills further.\n";
        }
        
        resultMessage += "\nWould you like more specific advice on any of these career paths?";
        
        // Add results to chat
        addMessageToChat(resultMessage, 'bot');
    }
    
    function getAdvancedCareerAdvice(userData) {
        // Create form data for sending to PHP backend
        const formData = new FormData();
        formData.append('name', 'User');
        formData.append('skills', userData.skills);
        formData.append('interests', userData.interests);
        formData.append('experience', userData.experience);
        formData.append('education', userData.education);
        formData.append('location', userData.location);
        formData.append('softSkills', userData.skills.split(',')[1]);
        
        // Make API call to backend
        fetch('backend.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Handle error
                addMessageToChat("Sorry, I encountered an error processing your assessment. Let me provide some general advice instead.", 'bot');
                provideSimpleAdvice(userData.skills.split(':')[1].split('/')[0], userData.skills.split(':')[2].split('/')[0], userData.interests);
            } else {
                // Format and display the detailed response from backend
                const formattedResponse = formatBackendResponse(data.response);
                addMessageToChat(formattedResponse, 'bot');
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
            addMessageToChat("Sorry, I encountered an error connecting to our career advice system. Let me provide some general advice instead.", 'bot');
            provideSimpleAdvice(userData.skills.split(':')[1].split('/')[0], userData.skills.split(':')[2].split('/')[0], userData.interests);
        });
    }
    
    function formatBackendResponse(response) {
        // Clean up the response from backend to display nicely in the chat
        // This assumes the backend responds with markdown that we want to preserve
        return response;
    }
    
    // Handle the "Chat With AI Advisor" button
    const openChatbotBtn = document.querySelector('.open-chatbot-btn');
    if (openChatbotBtn) {
        openChatbotBtn.addEventListener('click', () => {
            if (chatbotContainer) {
                chatbotContainer.classList.add('open');
                if (chatbotToggle) {
                    chatbotToggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            }
        });
    }
});