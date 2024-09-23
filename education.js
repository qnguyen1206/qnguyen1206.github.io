function collect_edu_1() {
    document.getElementById('education-1').src = "chestIconOpen.png";
    document.getElementById('button-edu-1').disabled = true;
    localStorage.setItem('edu1', 'true');
    let curr_edu_item = localStorage.getItem('curr_edu_item');
    curr_edu_item++;
    localStorage.setItem('curr_edu_item', curr_edu_item);
}

function collect_edu_2() {
    document.getElementById('education-2').src = "chestIconOpen.png";
    document.getElementById('button-edu-2').disabled = true;
    localStorage.setItem('edu2', 'true');
    let curr_edu_item = localStorage.getItem('curr_edu_item');
    curr_edu_item++;
    localStorage.setItem('curr_edu_item', curr_edu_item);
}

function checkEducationGameState() {
    const edu1 = localStorage.getItem('edu1');
    if (edu1 != null) {
        if (edu1 === 'true') {
            document.getElementById('education-1').src = "chestIconOpen.png";
            document.getElementById('button-edu-1').disabled = true;
        } else {
            document.getElementById('education-1').src = "chestIcon.png";
            document.getElementById('button-edu-1').disabled = false;
        }
    } else {
        document.getElementById('education-1').src = "chestIcon.png";
        document.getElementById('button-edu-1').disabled = false;
    }

    const edu2 = localStorage.getItem('edu2');
    if (edu2 != null) {
        if (edu2 === 'true') {
            document.getElementById('education-2').src = "chestIconOpen.png";
            document.getElementById('button-edu-2').disabled = true;
        } else {
            document.getElementById('education-2').src = "chestIcon.png";
            document.getElementById('button-edu-2').disabled = false;
        }
    } else {
        document.getElementById('education-2').src = "chestIcon.png";
        document.getElementById('button-edu-2').disabled = false;
    }
    
}

window.onload = checkEducationGameState;