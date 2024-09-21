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
    // getCryptoInfo();

    // Handle Form Submission
    document.querySelector('.add-transactio-btn').addEventListener('click', e => {
        e.preventDefault();
        clearErrorMessages();
        const formElement = document.querySelector('#transactionForm');
        const formData = new FormData(formElement);

        if (validateForm(formData)) {
            submitTransaction(formData);
        }
    });

    // Image File Name Update
    /* ZEND */
    /* document.querySelector('#id_img').addEventListener('change', function() {
        const fileName = this.files[0]?.name;
        if (fileName) {
            const truncatedFileName = fileName.length > 20 ? `${fileName.slice(0, 10)}...${fileName.slice(-10)}` : fileName;
            document.querySelector('#fileName').textContent = truncatedFileName;
            document.querySelector('#noFile').textContent = truncatedFileName;
        }
    }); */

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

    function getLast12Months() {
        const months = [];
        const today = new Date();
        
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(today.getMonth() - i);
            months.push(d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
        }
        
        return months;
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

    // Submit Transaction Form
    function submitTransaction(formData) {
        ajaxRequest('POST', '/add_transaction/', formData, response => {
            if (response.success) {
                document.querySelector('.modale').classList.remove('opened');
                updateDashboard();
                updateTransactions();
                showPopupMessage("Your transaction is under review.");
                document.querySelector('#transactionForm').reset();
                document.querySelector('#fileName').textContent = 'Choose File';
                document.querySelector('#noFile').textContent = 'No file chosen...';
            }
        }, true, false, showErrorPopupMessage);
    }

    // Transaction Template
    function getTransactionHTML(transaction) {
        const amountClass = transaction.type === 'profit' ? 'profit-background' : 'loss-background';
        const transactionTypeClass = transaction.type === 'profit' ? 'transaction-info-text' : 'transaction-info-text-loss';

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
                        <span class="amount-trade">${transaction.amount} $</span>
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

    // Validate Form Inputs
    function validateForm(formData) {
        let isValid = true;

        if (!formData.get('pair')) {
            showError('pairError', 'Pair is required.');
            isValid = false;
        }

        const amount = formData.get('amount');
        if (!amount) {
            showError('amountError', 'Amount is required.');
            isValid = false;
        } else if (isNaN(amount)) {
            showError('amountError', 'Amount must be a number.');
            isValid = false;
        }

        if (!formData.get('type')) {
            showError('typeError', 'Type is required.');
            isValid = false;
        }

        if (!formData.get('img')) {
            showError('imgError', 'Proof is required.');
            isValid = false;
        }

        return isValid;
    }

    // Show Error
    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    // Clear All Error Messages
    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(message => message.textContent = '');
    }

    // Show Popup Message
    function showPopupMessage(message) {
        const popup = document.getElementById('popupMessage');
        const popupSpan = document.getElementById('popupSpan');
        popupSpan.textContent = message;
        popup.style.display = 'block';

        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.style.display = 'none';
                popup.classList.remove('fade-out');
            }, 2000);
        }, 2000);
    }

    // Show Error Popup Message
    function showErrorPopupMessage(message) {
        const popup = document.getElementById('ErrorPopupMessage');
        const popupSpan = document.getElementById('ErrorPopupSpan');
        popupSpan.textContent = message;
        popup.style.display = 'block';

        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.style.display = 'none';
                popup.classList.remove('fade-out');
            }, 1000);
        }, 1000);
    }

    // Modal Open and Close
    document.querySelectorAll('.openmodale').forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('.modale').classList.add('opened');
        });
    });

    document.querySelectorAll('.closemodale').forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('.modale').classList.remove('opened');
        });
    });

    

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
});

