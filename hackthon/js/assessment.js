document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Define skill categories and questions
    const skillCategories = [
        {
            name: 'Technical Skills',
            skills: [
                'Programming',
                'Database Management',
                'Web Development',
                'Mobile Development',
                'Cloud Computing',
                'DevOps',
                'Data Analysis',
                'Machine Learning'
            ]
        },
        {
            name: 'Soft Skills',
            skills: [
                'Communication',
                'Leadership',
                'Problem Solving',
                'Time Management',
                'Teamwork',
                'Adaptability',
                'Critical Thinking',
                'Creativity'
            ]
        },
        {
            name: 'Business Skills',
            skills: [
                'Project Management',
                'Business Analysis',
                'Strategic Planning',
                'Marketing',
                'Sales',
                'Financial Management',
                'Customer Service',
                'Negotiation'
            ]
        }
    ];

    // Load assessment form
    function loadAssessment() {
        const assessmentForm = document.getElementById('assessmentForm');
        let html = '';

        skillCategories.forEach(category => {
            html += `
                <div class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-900">${category.name}</h3>
                    <div class="space-y-4">
                        ${category.skills.map(skill => `
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <label class="text-sm font-medium text-gray-700">${skill}</label>
                                    <span class="text-sm text-gray-500 proficiency-level">1/5</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="range" 
                                           min="1" 
                                           max="5" 
                                           value="1" 
                                           class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                           data-skill="${skill}"
                                           data-category="${category.name}">
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        assessmentForm.innerHTML = html;

        // Add event listeners to range inputs
        document.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', function() {
                this.closest('.space-y-2').querySelector('.proficiency-level').textContent = `${this.value}/5`;
            });
        });
    }

    // Handle assessment submission
    const submitAssessmentBtn = document.getElementById('submitAssessmentBtn');
    if (submitAssessmentBtn) {
        submitAssessmentBtn.addEventListener('click', async function() {
            const skills = [];
            document.querySelectorAll('input[type="range"]').forEach(input => {
                skills.push({
                    name: input.dataset.skill,
                    category: input.dataset.category,
                    proficiency_level: parseInt(input.value)
                });
            });

            try {
                const response = await fetch('api/profile.php', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'update_skills',
                        skills: skills
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit assessment');
                }

                alert('Assessment submitted successfully');
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting the assessment');
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
    loadAssessment();
}); 