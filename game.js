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

function backToMain() {
    window.location.href = "index.html";
}

function toggleNav(id) {
    const navLinks = document.getElementById(id);
    const computedStyle = window.getComputedStyle(navLinks);
    if (computedStyle.display == "flex") {
        navLinks.style.display = "none";
        navLinks.style.transform = "translateY(-100%)"
    } else if (computedStyle.display == "none") {
        navLinks.style.display = "flex";
        navLinks.style.transform = "translateY(0)"
    }
}

window.onload = checkCurrentGameState;