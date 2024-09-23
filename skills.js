function collect_skill_1() {
    document.getElementById('skill-1').src = "chestIconOpen.png";
    document.getElementById('button-skill-1').disabled = true;
    localStorage.setItem('skill1', 'true');
    let curr_skill_item = localStorage.getItem('curr_skill_item');
    curr_skill_item++;
    localStorage.setItem('curr_skill_item', curr_skill_item);
}

function collect_skill_2() {
    document.getElementById('skill-2').src = "chestIconOpen.png";
    document.getElementById('button-skill-2').disabled = true;
    localStorage.setItem('skill2', 'true');
    let curr_skill_item = localStorage.getItem('curr_skill_item');
    curr_skill_item++;
    localStorage.setItem('curr_skill_item', curr_skill_item);
}

function collect_skill_3() {
    document.getElementById('skill-3').src = "chestIconOpen.png";
    document.getElementById('button-skill-3').disabled = true;
    localStorage.setItem('skill3', 'true');
    let curr_skill_item = localStorage.getItem('curr_skill_item');
    curr_skill_item++;
    localStorage.setItem('curr_skill_item', curr_skill_item);
}

function collect_skill_4() {
    document.getElementById('skill-4').src = "chestIconOpen.png";
    document.getElementById('button-skill-4').disabled = true;
    localStorage.setItem('skill4', 'true');
    let curr_skill_item = localStorage.getItem('curr_skill_item');
    curr_skill_item++;
    localStorage.setItem('curr_skill_item', curr_skill_item);
}

function collect_skill_5() {
    document.getElementById('skill-5').src = "chestIconOpen.png";
    document.getElementById('button-skill-5').disabled = true;
    localStorage.setItem('skill5', 'true');
    let curr_skill_item = localStorage.getItem('curr_skill_item');
    curr_skill_item++;
    localStorage.setItem('curr_skill_item', curr_skill_item);
}

function checkSkillGameState() {
    const skill1 = localStorage.getItem('skill1');
    if (skill1 != null) {
        if (skill1 === 'true') {
            document.getElementById('skill-1').src = "chestIconOpen.png";
            document.getElementById('button-skill-1').disabled = true;
        } else {
            document.getElementById('skill-1').src = "chestIcon.png";
            document.getElementById('button-skill-1').disabled = false;
        }
    } else {
        document.getElementById('skill-1').src = "chestIcon.png";
        document.getElementById('button-skill-1').disabled = false;
    }

    const skill2 = localStorage.getItem('skill2');
    if (skill2 != null) {
        if (skill2 === 'true') {
            document.getElementById('skill-2').src = "chestIconOpen.png";
            document.getElementById('button-skill-2').disabled = true;
        } else {
            document.getElementById('skill-2').src = "chestIcon.png";
            document.getElementById('button-skill-2').disabled = false;
        }
    } else {
        document.getElementById('skill-2').src = "chestIcon.png";
        document.getElementById('button-skill-2').disabled = false;
    }

    const skill3 = localStorage.getItem('skill3');
    if (skill3 != null) {
        if (skill3 === 'true') {
            document.getElementById('skill-3').src = "chestIconOpen.png";
            document.getElementById('button-skill-3').disabled = true;
        } else {
            document.getElementById('skill-3').src = "chestIcon.png";
            document.getElementById('button-skill-3').disabled = false;
        }
    } else {
        document.getElementById('skill-3').src = "chestIcon.png";
        document.getElementById('button-skill-3').disabled = false;
    }

    const skill4 = localStorage.getItem('skill4');
    if (skill4 != null) {
        if (skill4 === 'true') {
            document.getElementById('skill-4').src = "chestIconOpen.png";
            document.getElementById('button-skill-4').disabled = true;
        } else {
            document.getElementById('skill-4').src = "chestIcon.png";
            document.getElementById('button-skill-4').disabled = false;
        }
    } else {
        document.getElementById('skill-4').src = "chestIcon.png";
        document.getElementById('button-skill-4').disabled = false;
    }

    const skill5 = localStorage.getItem('skill5');
    if (skill5 != null) {
        if (skill5 === 'true') {
            document.getElementById('skill-5').src = "chestIconOpen.png";
            document.getElementById('button-skill-5').disabled = true;
        } else {
            document.getElementById('skill-5').src = "chestIcon.png";
            document.getElementById('button-skill-5').disabled = false;
        }
    } else {
        document.getElementById('skill-5').src = "chestIcon.png";
        document.getElementById('button-skill-5').disabled = false;
    }
    
}

window.onload = checkSkillGameState;