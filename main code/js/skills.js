document.addEventListener('DOMContentLoaded', () => {
    const skillsForm = document.getElementById('skills-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';

    skillsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Remove any existing messages
        successMessage.remove();
        errorMessage.remove();

        // Collect form data
        const formData = new FormData(skillsForm);
        const skills = {};
        const additionalInfo = {};

        // Process skills ratings
        for (let [key, value] of formData.entries()) {
            if (key.includes('_')) {
                skills[key] = parseInt(value);
            } else {
                additionalInfo[key] = value;
            }
        }

        // Validate that all skills are rated
        const allSkillsRated = Object.values(skills).every(rating => !isNaN(rating));
        if (!allSkillsRated) {
            errorMessage.textContent = 'Please rate all skills before submitting.';
            skillsForm.insertBefore(errorMessage, skillsForm.firstChild);
            return;
        }

        try {
            // Show loading state
            const submitButton = skillsForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Send data to backend
            const response = await fetch('/api/career-suggestions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skills,
                    ...additionalInfo
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store suggestions in localStorage
                localStorage.setItem('careerSuggestions', JSON.stringify(data.suggestions));
                
                // Show success message
                successMessage.textContent = 'Career suggestions generated successfully! Redirecting...';
                skillsForm.insertBefore(successMessage, skillsForm.firstChild);

                // Redirect to results page after a short delay
                setTimeout(() => {
                    window.location.href = '/results.html';
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to generate career suggestions');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            skillsForm.insertBefore(errorMessage, skillsForm.firstChild);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    // Add hover effects to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add focus styles to form inputs
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}); 