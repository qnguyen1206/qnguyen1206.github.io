function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-content');
    const main = document.querySelector('main');

    dropdown.classList.toggle('show');
    main.classList.toggle('main-shift');
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn img')) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
};
