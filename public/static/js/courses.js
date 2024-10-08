document.addEventListener("DOMContentLoaded", function() {
    const details = document.querySelector(".course_details");
    let icon = document.querySelector(".title_cont");
    const courses = document.querySelectorAll(".course");

    icon.addEventListener("click", function() {
        icon = document.querySelector(".title_cont i");
        // Toggle the 'closed' class for course_details
        details.classList.toggle("closed");

        // Check if the details are closed and adjust icon accordingly
        if (details.classList.contains("closed")) {
            // Set the icon to 'up' (closed)
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        } else {
            // Set the icon to 'down' (open)
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    });

    courses.forEach(course => {
        course.addEventListener("click", function() {
            // Remove 'active' class from all courses
            courses.forEach(c => c.classList.remove("active"));

            // Add 'active' class to the clicked course
            course.classList.add("active");

            // Open the details section when a course is clicked
            details.style.display = "flex"
            details.classList.remove("closed"); // Ensure it's open
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");

            // Update course details
            details.querySelector(".d_image").src = course.getAttribute("data-image");
            details.querySelector(".tag").textContent = course.getAttribute("data-tag");
            details.querySelector(".cd_title").textContent = course.getAttribute("data-title");
            details.querySelector(".d_description").textContent = course.getAttribute("data-description");
        });
    });
});
