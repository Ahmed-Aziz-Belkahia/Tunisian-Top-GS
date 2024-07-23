document.addEventListener('DOMContentLoaded', function() {
    function toggleCollapse(inlineGroup) {
        const inlineTitle = inlineGroup.querySelector('.inline_label');
        const inlineContent = inlineGroup.querySelector('.inline-related');

        if (inlineTitle && inlineContent) {
            inlineTitle.style.cursor = 'pointer';
            inlineContent.style.display = 'none';

            inlineTitle.addEventListener('click', function() {
                if (inlineContent.style.display === 'none') {
                    inlineContent.style.display = 'block';
                } else {
                    inlineContent.style.display = 'none';
                }
            });
        }
    }

    const inlineGroups = document.querySelectorAll('.inline-group');
    inlineGroups.forEach(toggleCollapse);
});
