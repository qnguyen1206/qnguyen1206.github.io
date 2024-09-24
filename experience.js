function collect_experience_1() {
    document.getElementById('experience-1').src = "chestIconOpen.png";
    document.getElementById('button-experience-1').disabled = true;
    localStorage.setItem('experience1', 'true');
    let curr_experience_item = localStorage.getItem('curr_experience_item');
    curr_experience_item++;
    localStorage.setItem('curr_experience_item', curr_experience_item);
}

function checkExperienceGameState() {
    const experience1 = localStorage.getItem('experience1');
    if (experience1 != null) {
        if (experience1 === 'true') {
            document.getElementById('experience-1').src = "chestIconOpen.png";
            document.getElementById('button-experience-1').disabled = true;
        } else {
            document.getElementById('experience-1').src = "chestIcon.png";
            document.getElementById('button-experience-1').disabled = false;
        }
    } else {
        document.getElementById('experience-1').src = "chestIcon.png";
        document.getElementById('button-experience-1').disabled = false;
    }
    
}

window.onload = checkExperienceGameState;