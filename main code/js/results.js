document.addEventListener('DOMContentLoaded', () => {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const saveButton = document.getElementById('save-suggestions');
    const shareButton = document.getElementById('share-suggestions');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';

    // Get suggestions from localStorage
    const suggestions = JSON.parse(localStorage.getItem('careerSuggestions'));

    if (!suggestions || !suggestions.length) {
        errorMessage.textContent = 'No career suggestions found. Please complete the skills assessment first.';
        suggestionsContainer.insertBefore(errorMessage, suggestionsContainer.firstChild);
        return;
    }

    // Display suggestions
    suggestions.forEach((suggestion, index) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'career-suggestion';
        suggestionElement.innerHTML = `
            <h2>${suggestion.title}</h2>
            <div class="suggestion-details">
                <div class="detail-item">
                    <h3>Required Skills</h3>
                    <div class="skills-list">
                        ${suggestion.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="detail-item">
                    <h3>Salary Range</h3>
                    <p>${suggestion.salary}</p>
                </div>
                <div class="detail-item">
                    <h3>Growth Potential</h3>
                    <p>${suggestion.growth}</p>
                </div>
            </div>
            <div class="next-steps">
                <h3>Recommended Next Steps</h3>
                <ul>
                    ${suggestion.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        `;
        suggestionsContainer.appendChild(suggestionElement);
    });

    // Save suggestions
    saveButton.addEventListener('click', async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                throw new Error('Please login to save suggestions');
            }

            const response = await fetch('/api/save-suggestions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    suggestions
                })
            });

            const data = await response.json();

            if (response.ok) {
                successMessage.textContent = 'Suggestions saved successfully!';
                suggestionsContainer.insertBefore(successMessage, suggestionsContainer.firstChild);
            } else {
                throw new Error(data.message || 'Failed to save suggestions');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            suggestionsContainer.insertBefore(errorMessage, suggestionsContainer.firstChild);
        }
    });

    // Share suggestions
    shareButton.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Career Suggestions',
                text: 'Check out my personalized career suggestions from Career Compass!',
                url: window.location.href
            }).catch(error => {
                console.error('Error sharing:', error);
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareUrl = window.location.href;
            navigator.clipboard.writeText(shareUrl).then(() => {
                successMessage.textContent = 'Link copied to clipboard!';
                suggestionsContainer.insertBefore(successMessage, suggestionsContainer.firstChild);
            }).catch(error => {
                errorMessage.textContent = 'Failed to copy link. Please try again.';
                suggestionsContainer.insertBefore(errorMessage, suggestionsContainer.firstChild);
            });
        }
    });

    // Add hover effects to suggestion cards
    const suggestionCards = document.querySelectorAll('.career-suggestion');
    suggestionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}); 