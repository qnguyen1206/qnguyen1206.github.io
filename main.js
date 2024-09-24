function startGame() {
    window.location.href = "game.html";
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
    if (gameStarted != null) {
        if (gameStarted === 'true') {
            document.getElementsByClassName('continue-btn').disabled = false; // Enable "Continue" button
        } else {
            document.getElementsByClassName('continue-btn').disabled = true; // Disable "Continue" button
        }
    } else {
        document.getElementsByClassName('continue-btn').disabled = true; // Disable "Continue" button
    }
}

// Run the check when the page loads
window.onload = checkGameState;