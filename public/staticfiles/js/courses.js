document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courses = document.querySelectorAll('.course');
    const noCoursesMessage = document.querySelector('.no-courses-message');
    const courseList = document.querySelector('.course-list');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            let coursesFound = false;

            courses.forEach(course => {
                course.classList.remove('slide-in');
                if (filter === 'all' || course.getAttribute('data-category') === filter) {
                    course.style.display = 'block';
                    void course.offsetWidth; // Trigger reflow for CSS animation
                    course.classList.add('slide-in');
                    coursesFound = true;
                } else {
                    course.style.display = 'none';
                }
            });

            if (!coursesFound) {
                courseList.classList.add('hidden');
                noCoursesMessage.style.display = 'flex';
                noCoursesMessage.innerText = `${filter} courses coming soon`;
            } else {
                courseList.classList.remove('hidden');
                noCoursesMessage.style.display = 'none';
            }
        });
    });
});
