function checkCurrentGameState() {
    var edu_percentage = (localStorage.getItem('curr_edu_item')/localStorage.getItem('total_edu_item')) * 100;
    document.getElementById('education-progress').innerHTML = "(" + edu_percentage + "% Complete)";

    var skill_percentage = (localStorage.getItem('curr_skill_item')/localStorage.getItem('total_skill_item')) * 100;
    document.getElementById('skill-progress').innerHTML = "(" + skill_percentage + "% Complete)";

    var project_percentage = (localStorage.getItem('curr_project_item')/localStorage.getItem('total_project_item')) * 100;
    document.getElementById('project-progress').innerHTML = "(" + project_percentage + "% Complete)";

    var experience_percentage = (localStorage.getItem('curr_experience_item')/localStorage.getItem('total_experience_item')) * 100;
    document.getElementById('experience-progress').innerHTML = "(" + experience_percentage + "% Complete)";
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