function collect_project_1() {
    document.getElementById('project-1').src = "chestIconOpen.png";
    document.getElementById('button-project-1').disabled = true;
    localStorage.setItem('project1', 'true');
    let curr_project_item = localStorage.getItem('curr_project_item');
    curr_project_item++;
    localStorage.setItem('curr_project_item', curr_project_item);
}

function checkProjectGameState() {
    const project1 = localStorage.getItem('project1');
    if (project1 != null) {
        if (project1 === 'true') {
            document.getElementById('project-1').src = "chestIconOpen.png";
            document.getElementById('button-project-1').disabled = true;
        } else {
            document.getElementById('project-1').src = "chestIcon.png";
            document.getElementById('button-project-1').disabled = false;
        }
    } else {
        document.getElementById('project-1').src = "chestIcon.png";
        document.getElementById('button-project-1').disabled = false;
    }
    
}

window.onload = checkProjectGameState;