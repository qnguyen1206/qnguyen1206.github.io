function checkCurrentGameState() {
    document.getElementById('education-progress').innerHTML = localStorage.getItem('curr_edu_item') + "/" + localStorage.getItem('total_edu_item') + " Chests Collect";

    document.getElementById('skill-progress').innerHTML = localStorage.getItem('curr_skill_item') + "/" + localStorage.getItem('total_skill_item') + " Chests Collect";

    document.getElementById('project-progress').innerHTML = localStorage.getItem('curr_project_item') + "/" + localStorage.getItem('total_project_item') + " Chests Collect";

    document.getElementById('experience-progress').innerHTML = localStorage.getItem('curr_experience_item') + "/" + localStorage.getItem('total_experience_item') + " Chests Collect";
}

function restartGame() {
    window.location.href = "index.html";
    localStorage.clear();
}

function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('nav-active');
}

window.onload = checkCurrentGameState;