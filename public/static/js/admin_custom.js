document.addEventListener('DOMContentLoaded', function() {
    const toggleLinks = document.querySelectorAll('.toggle-level');

    toggleLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const levelId = this.getAttribute('data-level-id');
            const levelElement = document.getElementById(`level-${levelId}`);
            if (levelElement) {
                levelElement.classList.toggle('hidden');
            }
        });
    });
});
