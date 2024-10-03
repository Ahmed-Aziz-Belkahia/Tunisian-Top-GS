document.addEventListener('DOMContentLoaded', () => {
    let firstLoad = true;

    // Initialize the Chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: getLast30Days(),
            datasets: [{
                label: 'Total Balance',
                data: [],
                borderColor: '#a45cf6',
                borderWidth: 3.3,
                lineTension: 0.55,
                fill: true,
                backgroundColor: 'rgba(164, 92, 246, 0.09)',
                pointRadius: 0.5,
                pointBackgroundColor: '#BDC4CD',
                pointBorderColor: 'white',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: '#f5f5f5b9',
                        font: { family: 'Poppins' }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: tooltipItems => tooltipItems[0].label,
                        label: context => `${context.dataset.label || ''}: ${context.parsed.y} $`
                    },
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    bodyFont: { family: 'Poppins' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#f5f5f521' },
                    ticks: {
                        color: '#ffffff',
                        callback: value => `${value} $`,
                        font: { family: 'Poppins' }
                    }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0)', borderColor: 'rgba(255, 255, 255, 1)' },
                    ticks: {
                        color: '#f5f5f521',
                        font: { family: 'Poppins' }
                    }
                }
            }
        }
    });

    // Plugins for Chart.js
    Chart.register({
        id: 'shadowPlugin',
        afterDatasetsDraw: chart => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach(dataset => {
                const meta = chart.getDatasetMeta(dataset.index);
                if (!meta.hidden) {
                    meta.data.forEach(element => {
                        ctx.fillStyle = '#056d93';
                        ctx.shadowColor = '#056d93';
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
            });
        }
    }, {
        id: 'colorChangePlugin',
        beforeDatasetsDraw: chart => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            ctx.save();
            ctx.lineWidth = chart.data.datasets[0].borderWidth;
            meta.data.forEach((curr, index) => {
                if (index < meta.data.length - 1) {
                    const next = meta.data[index + 1];
                    if (curr.parsed && next.parsed) {
                        ctx.beginPath();
                        ctx.moveTo(curr.x, curr.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.strokeStyle = curr.parsed.y >= 0 ? 'green' : 'red';
                        ctx.stroke();
                    }
                }
            });
            ctx.restore();
        }
    });

    // Function Calls
    updateDashboard();
    updateTransactions();
    updateChart('day');



    // Get Last 30 Days for Chart Labels
    function getLast30Days() {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return days;
    }


    // Fetch Crypto Info
    // function getCryptoInfo() {
    //     toggleSpinners(true);
    //     ajaxRequest('GET', '/getCryptoDetails/', null, response => {
    //         if (response.success) {
    //             const { btc, eth, sol } = response.crypto_details;
    //             updateCryptoValues(btc, eth, sol);
    //             toggleSpinners(false);
    //             firstLoad = false;
    //         }
    //     });
    // }

    // // Update Crypto Values on the Page
    // function updateCryptoValues(btc, eth, sol) {
    //     const cryptoElements = [
    //         { class: 'btc', value: btc },
    //         { class: 'eth', value: eth },
    //         { class: 'ltc', value: sol }
    //     ];

    //     cryptoElements.forEach(crypto => {
    //         document.querySelector(`.percentage-down-up.${crypto.class}`).textContent = `%${crypto.value[1].toFixed(2)}`;
    //         document.querySelector(`.price-v.${crypto.class}`).textContent = `$${crypto.value[0]}`;
    //     });
    // }

    // // Show/Hide Spinners
    // function toggleSpinners(show) {
    //     ['btc', 'eth', 'ltc'].forEach(crypto => {
    //         document.querySelector(`.${crypto}-spinner`).style.display = show ? 'block' : 'none';
    //         document.querySelector(`.price-v.${crypto}`).style.display = show ? 'none' : 'block';
    //     });
    // }

    // Update Dashboard
    function updateDashboard() {
        ajaxRequest('GET', '/getDashboard/', null, response => {
            if (response.success) {
                const { balance, objectif, profits, losses, profits_percentage, losses_percentage } = response.dashboard;
                document.querySelector('.counter-up-value.bal').textContent = `$${balance}`;
                document.querySelector('.counter-up-value.obj').textContent = `$${objectif}`;
                document.querySelector('.profits').textContent = `+$${profits}`;
                document.querySelector('.losses').textContent = `-$${losses}`;
                document.querySelector('.counter-up-value.profits').textContent = `%${profits_percentage}`;
                document.querySelector('.counter-up-value.losses').textContent = `-%${losses_percentage}`;
                myChart.update();
            }
        });
    }

    // Update Transactions
    function updateTransactions() {
        const transactionHistoryElement = document.querySelector('.transactions-history');
        ajaxRequest('GET', '/getTransactions/', null, response => {
            if (response.success) {
                transactionHistoryElement.innerHTML = '';
                if (response.transactions.length === 0) {
                    transactionHistoryElement.insertAdjacentHTML('beforeend', getNoTransactionsHTML());
                } else {
                    response.transactions.slice(0, 4).forEach(transaction => {
                        transactionHistoryElement.insertAdjacentHTML('beforeend', getTransactionHTML(transaction));
                    });
                }
            }
        });
    }

    // Update Chart with Data
    function updateChart(type) {
        document.getElementById('chartLoader').style.display = 'flex';
        ajaxRequest("POST", "/get_dashboard_log/", {type: type}, response => {
            if (response && response.log_list?.length) {
                myChart.data.datasets[0].data = response.log_list.map(log => log[0]).reverse();
                myChart.data.labels = response.log_list.map(log => log[1]).reverse();
                myChart.update();
            }
            document.getElementById('chartLoader').style.display = 'none';
        });
    }


    // Transaction Template
    function getTransactionHTML(transaction) {
        const amountClass = transaction.type === 'profit' ? 'profit-background' : 'loss-background';
        const amounttradeClass = transaction.type === 'profit' ? 'a-profit' : 'a-loss';
        const transactionTypeClass = transaction.type === 'profit' ? 'transaction-info-text-profit' : 'transaction-info-text-loss';

        return `
            <div class="history-user-transc">
                <div class="ianloine">
                    <div class="profile-picture-container">
                        <img class="profile-user-transaction" src="${transaction.pfp}" alt="">
                    </div>
                    <div class="informations-user">
                        <div class="name-fser">
                            <span class="foll">${transaction.user}</span>
                        </div>
                    </div>
                </div>
                <div class="data-transaction-info">
                    <div class="data-transaction">
                        <span class="data-transaction-text">
                            ${transaction.pair} <span class="transaction-info-text ${transactionTypeClass}">${transaction.type}</span>
                        </span>
                    </div>
                    <div class="transaction-amount-container ${amountClass}">
                        <span class="amount-trade ${amounttradeClass}">${transaction.amount} $</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle No Transactions Case
    function getNoTransactionsHTML() {
        return `
            <div class="no-transactions-message">
                <svg ...>...</svg>
                No transactions have been added.
            </div>
        `;
    }

    

    const selected = document.querySelector('.dropdown-selected');
    const optionsList = document.querySelectorAll('.dropdown-option');

    // Set selected option and close dropdown
    optionsList.forEach(function(option) {
        option.addEventListener('click', function() {
            selected.innerText = this.innerText;
            updateChart(this.innerText)
        });
    });



    const upArrow = document.querySelector('.slider-arrow-up');
    const downArrow = document.querySelector('.slider-arrow-down');
    const cryptoList = document.querySelector('.crypto-list');
    
    let scrollAmount = 0;
    let maxScroll = cryptoList.scrollHeight - cryptoList.clientHeight;
    
    upArrow.addEventListener('click', () => {
        if (scrollAmount > 0) {
            scrollAmount -= 220; // Adjust scroll step as needed
            cryptoList.scrollTo({
                top: scrollAmount,
                behavior: 'smooth' // Smooth as a Bugatti cruising the highway
            });
        }
    });
    
    downArrow.addEventListener('click', () => {
        if (scrollAmount < maxScroll) {
            scrollAmount += 220;
            cryptoList.scrollTo({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    });
    
    cryptoList.addEventListener('scroll', () => {
        scrollAmount = cryptoList.scrollTop;
    });

    
    getCryptoInfo()


    function getCryptoInfo() {
        toggleSpinners(true);

        ajaxRequest('GET', '/getCryptoDetails/', null, response => {
            if (response.success) {
                console.log("test")
                const { btc, eth, sol } = response.crypto_details;
                updateCryptoValues(btc, eth, sol);
                toggleSpinners(false);
            }
        }, null, true, "Update crypto", () => {
            if (firstLoad) firstLoad = false;
        });
    }

    function updateCryptoValues(btc, eth, sol) {
        const cryptoElements = [
            { class: 'btc', value: btc },
            { class: 'eth', value: eth },
            { class: 'ltc', value: sol }
        ];

        cryptoElements.forEach(crypto => {
            console.log(crypto)
            document.querySelector(`.crypto-value.${crypto.class}`).textContent = `${crypto.value[1].toFixed(2)}%`;
            /* document.querySelector(`.price-v.${crypto.class}`).textContent = `$${crypto.value[0]}`; */
        });
    }

    function toggleSpinners(show) {
        ['btc', 'eth', 'ltc'].forEach(crypto => {
            document.querySelector(`.${crypto}-spinner`).style.display = show ? 'block' : 'none';
            document.querySelector(`.main-c.${crypto}`).style.display = show ? 'none' : 'block';
        });
    }





// Get modal, button, and close elements
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on the close (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Show Error Message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Clear all error messages
function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(message => message.classList.remove('show'));
}

// Show popup message
function showPopupMessage(message, isError = false) {
    const popup = document.getElementById(isError ? 'ErrorPopupMessage' : 'popupMessage');
    const popupSpan = popup.querySelector('span');
    popupSpan.textContent = message;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}
// Validate the form data
function validateForm(formData) {
    let isValid = true;

    // Clear previous error messages
    clearErrorMessages();

    // Validate 'Pair' input
    const pair = formData.get('pair');
    if (!pair || pair.trim() === "") {
        showError('pairError', 'Pair is required.');
        isValid = false;
    }

    // Validate 'Amount' input
    const amount = formData.get('amount');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        showError('amountError', 'Amount must be a positive number.');
        isValid = false;
    }

    // Validate 'Type' dropdown
    const type = formData.get('type');
    if (!type) {
        showError('typeError', 'Type is required.');
        isValid = false;
    }

    // Validate image upload
    const img = formData.get('img');
    if (!img || img.size === 0) {
        showError('imgError', 'Proof image is required.');
        isValid = false;
    }

    return isValid;
}

// Form submission and validation handling
document.querySelector('#submitBtn').addEventListener('click', e => {
    e.preventDefault();
    clearErrorMessages();
    const formElement = document.querySelector('#transactionForm');
    const formData = new FormData(formElement);

    if (validateForm(formData)) {
        $.ajax({
            type: 'POST',
            url: '/add_transaction/',
            data: formData,
            processData: false,
            contentType: false,
            success: response => {
                if (response.success) {
                    modal.style.display = "none";
                    showPopupMessage("Your transaction is under review.");
                    formElement.reset();
                }
            },
            error: xhr => {
                console.error(xhr.responseText);
                showPopupMessage("There was an error submitting your transaction.", true);
            }
        });
    }
});


});
