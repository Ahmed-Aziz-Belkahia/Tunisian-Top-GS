document.addEventListener('DOMContentLoaded', function() {
    const cartCountElement = document.getElementById('cartCount');
    const subTotalDiv = document.querySelector(".subTotal");
    const TotalDiv = document.querySelector('.TTotal');
    const discountDiv = document.querySelector('.discountAmount');
    const couponDiv = document.querySelector('.couponApplied');
    const deleteButtons = document.querySelectorAll('.delete-icon');
    const decrementButtons = document.querySelectorAll('.quantity-selector button[data-bs-step="down"]');
    const incrementButtons = document.querySelectorAll('.quantity-selector button[data-bs-step="up"]');
    const couponButton = document.querySelector('.cupon-btn');
    const couponInput = document.querySelector('.cupon-input');
    const checkoutButton = document.querySelector('.checkoutbtn');
    const buttonText = document.getElementById('buttonText');
    const loadingIcon = document.getElementById('loadingIcon');

    function updateCartDisplay(response) {
        if (subTotalDiv) subTotalDiv.innerText = `TND ${response.total_price}`;
        if (TotalDiv) TotalDiv.innerText = `TND ${response.ultimate_total}`;
        if (discountDiv) discountDiv.innerText = `TND ${response.discount_amount}`;
        if (couponDiv) couponDiv.innerText = `TND ${response.discount_amount}`;
        if (cartCountElement) cartCountElement.innerText = response.total_items;
    }

    function showPopup(message) {
        const popupMessage = document.getElementById('popupMessage');
        const popupSpan = document.getElementById('popupSpan');
        popupSpan.innerText = message;
        popupMessage.style.display = 'flex';
        setTimeout(() => {
            popupMessage.style.display = 'none';
        }, 2000);
    }

    function handleQuantityChange(button, increment, max) {
        const itemContainer = button.closest('.item-container');
        const itemId = itemContainer.querySelector('.delete-icon').dataset.itemId;
        const quantityInput = itemContainer.querySelector('input[name="quantity"]');
        let quantity = parseInt(quantityInput.value);

        if (increment && quantity < max) {
            quantity++;
        } else if (!increment && quantity > 1) {
            quantity--;
        } else {
            quantityInput.classList.add('shake');
            setTimeout(() => quantityInput.classList.remove('shake'), 500);
            return;
        }

        const data = {
            item_id: itemId,
            quantity: quantity,
            product_id: itemContainer.dataset.productId,
            color: itemContainer.dataset.color,
            size: itemContainer.dataset.size
        };

        $.ajax({
            type: 'POST',
            url: '/update-cart-quantity/',
            data: data,
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
            },
            success: function(response) {
                if (response.success) {
                    quantityInput.value = quantity;
                    updateCartDisplay(response);
                } else {
                    showPopup(response.message);
                }
            },
            error: function(error) {
                console.error('Error updating cart quantity:', error);
                showPopup('An error occurred. Please try again.');
            }
        });
    }

    decrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleQuantityChange(this, false, button.getAttribute('data-quantity'));
        });
    });

    incrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleQuantityChange(this, true, button.getAttribute('data-quantity'));
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = button.dataset.itemId;
            $.ajax({
                type: 'POST',
                url: '/delete-cart-item/',
                data: { itemId: itemId },
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
                },
                success: function (response) {
                    if (response.success) {
                        document.querySelector(`.item-container.p${itemId}`).remove();
                        showPopup('Item has been deleted.');
                        updateCartDisplay(response);
                    } else {
                        showPopup('Error deleting item.');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting cart item:', error);
                    showPopup('An error occurred. Please try again.');
                }
            });
        });
    });

    checkoutButton.addEventListener('click', function(event) {
        event.preventDefault();

        buttonText.textContent = 'Processing...';
        loadingIcon.style.display = 'inline-block';

        setTimeout(function() {
            $.ajax({
                type: 'POST',
                url: '/final-cart-checkout/',
                data: {
                    cartId: cartId,
                    price: cartPrice + 7,
                    shippingMethod: 1,
                    shippingCost: 7
                },
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
                },
                success: function(response) {
                    if (response.success) {
                        window.location.href = '/checkout';
                    } else {
                        showPopup('Error during checkout.');
                        buttonText.textContent = 'Proceed to Checkout';
                        loadingIcon.style.display = 'none';
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error during checkout:', error);
                    showPopup('Error during checkout.');
                    buttonText.textContent = 'Proceed to Checkout';
                    loadingIcon.style.display = 'none';
                }
            });
        }, 1500);
    });

    couponButton.addEventListener('click', function() {
        const coupon = couponInput.value;
          
        $.ajax({
            type: 'POST',
            url: '/apply_coupon/',
            data: {
                coupon: coupon,
                cart_id: cartId
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
            },
            success: function(response) {
                if (response.success) {
                    showPopup('Coupon applied successfully.');
                    couponButton.innerHTML = '✔ Coupon Applied';
                    couponButton.classList.add('coupon-applied-animation');
                    couponInput.disabled = true;
                    updateCartDisplay(response);
                } else {
                    showPopup(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error applying coupon:', error);
                showPopup('An error occurred. Please try again.');
            }
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
