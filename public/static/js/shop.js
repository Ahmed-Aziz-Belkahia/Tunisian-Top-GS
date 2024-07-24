document.addEventListener('DOMContentLoaded', function() {
    // initializeWishlist();
    initializeCartCounter();
    initializeSubscriptionForm();
    initializeLikeButtons();
    initializePagination();

    // function initializeWishlist() {
    //     const likeButtons = document.querySelectorAll('.card-icon');
    //     const wishlistCounter = document.querySelector('.counter-items-wishlist');
    //     const likedItems = JSON.parse(localStorage.getItem('likedItems') || '{}');

    //     wishlistCounter.textContent = localStorage.getItem('wishlistCount') || 0;

    //     likeButtons.forEach(button => {
    //         const itemId = button.getAttribute('data-item-id');

    //         if (likedItems[itemId]) {
    //             button.querySelector('svg').style.fill = '#E2264D';
    //         }

    //         button.addEventListener('click', function(event) {
    //             event.preventDefault();
    //             const svg = this.querySelector('svg');
    //             if (!svg.style.fill) {
    //                 svg.style.fill = '#E2264D';
    //                 likedItems[itemId] = true;
    //                 wishlistCounter.textContent = parseInt(wishlistCounter.textContent) + 1;
    //             } else {
    //                 svg.style.fill = '';
    //                 delete likedItems[itemId];
    //                 wishlistCounter.textContent = Math.max(0, parseInt(wishlistCounter.textContent) - 1);
    //             }

    //             localStorage.setItem('likedItems', JSON.stringify(likedItems));
    //             localStorage.setItem('wishlistCount', wishlistCounter.textContent);
    //         });
    //     });
    // }


    function initializeCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const counterElement = document.querySelector('.counter-items-cart');
        if (counterElement) {
            counterElement.textContent = cart.length.toString();
        }
    }

    function initializeSubscriptionForm() {
        document.querySelector(".subscribe").addEventListener('click', function(event) {
            event.preventDefault();
            const email = document.querySelector(".inputs-sub").value;
            if (email) {
                ajaxRequest("POST", "/optIn/", { email: email }, function(response) {
                    document.querySelector(".subscribe").textContent = "SUBMITTED";
                    showPopup(response.message);
                }, function() {
                    showPopup("An error occurred. Please try again.");
                }, true, "Opt in", null);
            } else {
                showPopup("Please enter a valid email address.");
            }
        });

        function showPopup(message) {
            const popup = document.getElementById("popupMessage");
            document.getElementById("popupSpan").textContent = message;
            popup.style.display = "block";
            document.getElementById("popUpCloseButton").addEventListener('click', function() {
                popup.style.display = "none";
            });
        }
    }

    function initializeLikeButtons() {
        const likeButtons = document.querySelectorAll('.card-icon');

        likeButtons.forEach(element => {
            toggleLikeCss(element, element.getAttribute("data-id"));
            element.addEventListener("click", function(event) {
                event.preventDefault();
                toggleLike(event.currentTarget, element.getAttribute("data-id"));
            });
        });

        function toggleLike(element, currentProduct) {
            ajaxRequest("post", "/is_product_liked/", { product_id: currentProduct }, function(response) {
                if (response.is_liked) {
                    ajaxRequest("post", "/remove_liked_product/", { product_id: currentProduct }, function() {
                        toggleLikeCss(element, currentProduct);
                    }, null, true, "Remove liked product", null);
                } else {
                    ajaxRequest("post", "/add_liked_product/", { product_id: currentProduct }, function() {
                        toggleLikeCss(element, currentProduct);
                    }, null, true, "Add liked product", null);
                }
            }, null, true, "Check if product is liked", null);
        }

        function toggleLikeCss(element, currentProduct) {
            ajaxRequest("post", "/is_product_liked/", { product_id: currentProduct }, function(response) {
                if (response.is_liked) {
                    element.classList.add("liked");
                    element.querySelector('svg').style.fill = '#E2264D';
                } else {
                    element.classList.remove("liked");
                    element.querySelector('svg').style.fill = '';
                }
            }, null, true, "Check if product is liked", null);
        }
    }

    function initializePagination() {
        let currentIndex = 0;
        const items = document.querySelectorAll('.item-card');
        const itemsPerPage = 4;
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        function showItems() {
            items.forEach((item, index) => {
                if (index >= currentIndex * itemsPerPage && index < (currentIndex + 1) * itemsPerPage) {
                    item.classList.remove('fade-exit', 'fade-exit-active');
                    item.classList.add('fade-enter');
                    setTimeout(() => item.classList.add('fade-enter-active'), 0);
                    item.style.display = 'block';
                } else {
                    item.classList.remove('fade-enter', 'fade-enter-active');
                    item.classList.add('fade-exit');
                    setTimeout(() => item.classList.add('fade-exit-active'), 0);
                    item.style.display = 'none';
                }
            });
        }

        document.querySelector('.next').addEventListener('click', () => {
            if (currentIndex < totalPages - 1) {
                currentIndex++;
                showItems();
            }
        });

        document.querySelector('.prev').addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                showItems();
            }
        });

        showItems();
    }
});
