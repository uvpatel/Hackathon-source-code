// Skills Assessment Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js
    const ctx = document.getElementById('technicalSkillsChart').getContext('2d');
    let skillsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Programming', 'Data Analysis', 'Design', 'Project Management'],
            datasets: [{
                label: 'Your Skills',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 5,
                    stepSize: 1
                }
            }
        }
    });

    // Update chart when ratings change
    document.querySelectorAll('.rating input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const skillName = this.name;
            const value = parseInt(this.value);
            const index = skillsChart.data.labels.indexOf(skillName);
            if (index !== -1) {
                skillsChart.data.datasets[0].data[index] = value;
                skillsChart.update();
            }
        });
    });

    // Write About Me functionality
    const profileForm = document.getElementById('profile-form');
    const strengthInput = document.getElementById('strength-input');
    const tagsContainer = document.querySelector('.tags-container');
    const achievementsContainer = document.querySelector('.achievements-container');
    const characterCount = document.querySelector('.character-count');
    const summaryTextarea = document.getElementById('professional-summary');

    // Character count for professional summary
    summaryTextarea.addEventListener('input', function() {
        const count = this.value.length;
        characterCount.textContent = `${count}/200 characters`;
        document.querySelector('.summary-preview').textContent = this.value;
    });

    // Add strength tags
    strengthInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const strength = this.value.trim();
            if (strength) {
                addStrengthTag(strength);
                this.value = '';
            }
        }
    });

    function addStrengthTag(strength) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${strength}
            <button type="button">&times;</button>
        `;
        tag.querySelector('button').addEventListener('click', function() {
            tag.remove();
            updateStrengthsPreview();
        });
        tagsContainer.appendChild(tag);
        updateStrengthsPreview();
    }

    function updateStrengthsPreview() {
        const strengthsPreview = document.querySelector('.strengths-preview');
        strengthsPreview.innerHTML = '';
        document.querySelectorAll('.tag').forEach(tag => {
            const strength = tag.textContent.trim();
            const strengthTag = document.createElement('div');
            strengthTag.className = 'strength-tag';
            strengthTag.textContent = strength;
            strengthsPreview.appendChild(strengthTag);
        });
    }

    // Add achievements
    document.querySelector('.add-achievement-btn').addEventListener('click', function() {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        achievementItem.innerHTML = `
            <input type="text" placeholder="Achievement title">
            <textarea placeholder="Describe your achievement and its impact"></textarea>
            <button class="remove-achievement">Remove</button>
        `;
        achievementsContainer.appendChild(achievementItem);

        // Add event listeners for the new achievement
        const inputs = achievementItem.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateAchievementsPreview);
        });

        achievementItem.querySelector('.remove-achievement').addEventListener('click', function() {
            achievementItem.remove();
            updateAchievementsPreview();
        });
    });

    function updateAchievementsPreview() {
        const achievementsPreview = document.querySelector('.achievements-preview');
        achievementsPreview.innerHTML = '';
        document.querySelectorAll('.achievement-item').forEach(item => {
            const title = item.querySelector('input').value;
            const description = item.querySelector('textarea').value;
            if (title || description) {
                const achievementPreview = document.createElement('div');
                achievementPreview.className = 'achievement-preview-item';
                achievementPreview.innerHTML = `
                    <h5>${title || 'Untitled Achievement'}</h5>
                    <p>${description || 'No description provided'}</p>
                `;
                achievementsPreview.appendChild(achievementPreview);
            }
        });
    }

    // Update career goals preview
    document.getElementById('career-goals').addEventListener('input', function() {
        document.querySelector('.goals-preview').textContent = this.value;
    });

    // Update industries preview
    document.getElementById('preferred-industries').addEventListener('change', function() {
        const industriesPreview = document.querySelector('.industries-preview');
        industriesPreview.innerHTML = '';
        Array.from(this.selectedOptions).forEach(option => {
            const industryTag = document.createElement('div');
            industryTag.className = 'industry-tag';
            industryTag.textContent = option.text;
            industriesPreview.appendChild(industryTag);
        });
    });

    // Form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the data to your backend
        alert('Profile saved successfully!');
    });
}); 