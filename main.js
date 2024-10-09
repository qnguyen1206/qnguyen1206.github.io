function startGame() {
    window.location.href = "game.html";
    localStorage.clear();
    localStorage.setItem("gameStarted", 'true');

    localStorage.setItem("total_edu_item", 2);
    localStorage.setItem("curr_edu_item", 0);

    localStorage.setItem("total_skill_item", 5);
    localStorage.setItem("curr_skill_item", 0);

    localStorage.setItem("total_project_item", 1);
    localStorage.setItem("curr_project_item", 0);

    localStorage.setItem("total_experience_item", 1);
    localStorage.setItem("curr_experience_item", 0);
}

function continueGame() {
    window.location.href = "game.html";
}

// Function to check the game state when loading the page
function checkGameState() {
    const gameStarted = localStorage.getItem('gameStarted');
    const continueButton = document.querySelector('.continue-btn'); // Single element

    if (gameStarted === 'true') {
        continueButton.disabled = false; // Enable "Continue" button
    } else {
        continueButton.disabled = true; // Disable "Continue" button
    }
}

// Run the check when the page loads
window.onload = checkGameState;