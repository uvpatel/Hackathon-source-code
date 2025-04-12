document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Load profile and skills data
    async function loadProfileData() {
        try {
            const response = await fetch('api/profile.php', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load profile data');
            }

            const data = await response.json();
            populateProfileForm(data.profile);
            displaySkills(data.available_skills, data.skills);
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    // Populate profile form
    function populateProfileForm(profile) {
        document.getElementById('fullName').value = profile.full_name || '';
        document.getElementById('educationLevel').value = profile.education_level || '';
        document.getElementById('currentOccupation').value = profile.current_occupation || '';
        document.getElementById('yearsExperience').value = profile.years_experience || '';
    }

    // Display skills with proficiency levels
    function displaySkills(availableSkills, userSkills) {
        const skillsList = document.getElementById('skillsList');
        
        let html = '';
        availableSkills.forEach(skill => {
            const userSkill = userSkills.find(s => s.id === skill.id);
            const proficiencyLevel = userSkill ? userSkill.proficiency_level : 1;
            
            html += `
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <label class="text-sm font-medium text-gray-700">${skill.name}</label>
                        <span class="text-sm text-gray-500">${skill.category}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="range" 
                               min="1" 
                               max="5" 
                               value="${proficiencyLevel}" 
                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                               data-skill-id="${skill.id}">
                        <span class="text-sm text-gray-500">${proficiencyLevel}/5</span>
                    </div>
                </div>
            `;
        });

        skillsList.innerHTML = html;

        // Add event listeners to range inputs
        document.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', function() {
                this.nextElementSibling.textContent = `${this.value}/5`;
            });
        });
    }

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const profileData = {
                full_name: document.getElementById('fullName').value,
                education_level: document.getElementById('educationLevel').value,
                current_occupation: document.getElementById('currentOccupation').value,
                years_experience: document.getElementById('yearsExperience').value
            };

            try {
                const response = await fetch('api/profile.php', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'update_profile',
                        profile: profileData
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                alert('Profile updated successfully');
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating profile');
            }
        });
    }

    // Handle skills save
    const saveSkillsBtn = document.getElementById('saveSkillsBtn');
    if (saveSkillsBtn) {
        saveSkillsBtn.addEventListener('click', async function() {
            const skills = [];
            document.querySelectorAll('input[type="range"]').forEach(input => {
                skills.push({
                    skill_id: parseInt(input.dataset.skillId),
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
                    throw new Error('Failed to update skills');
                }

                alert('Skills updated successfully');
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating skills');
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
    loadProfileData();
}); 