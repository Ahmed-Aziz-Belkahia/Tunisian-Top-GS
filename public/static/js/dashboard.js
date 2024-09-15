document.addEventListener('DOMContentLoaded', () => {
    let firstLoad = true;
    
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
            chart.data.datasets.forEach(dataset => {
                const meta = chart.getDatasetMeta(0);
                ctx.save();
                ctx.lineWidth = dataset.borderWidth;
                for (let i = 0; i < meta.data.length - 1; i++) {
                    const curr = meta.data[i];
                    const next = meta.data[i + 1];
                    if (curr.parsed && next.parsed) {
                        ctx.beginPath();
                        ctx.moveTo(curr.x, curr.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.strokeStyle = curr.parsed.y >= 0 ? 'green' : 'red';
                        ctx.stroke();
                    }
                }
                ctx.restore();
            });
        }
    });

    updateDashboard();
    updateTransactions();
    UpdateChart();
    getCryptoInfo();

    document.querySelector('.THEbutton').addEventListener('click', e => {
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
                        $('.modale').removeClass('opened');
                        updateDashboard();
                        updateTransactions();
                        showPopupMessage("Your transaction is under review.");
                        formElement.reset();
                        document.querySelector('#fileName').textContent = 'Choose File';
                        document.querySelector('#noFile').textContent = 'No file chosen...';
                    }
                },
                error: xhr => {
                    console.error(xhr.responseText);
                    showErrorPopupMessage("There was an error submitting your transaction.");
                }
            });
        }
    });

    document.querySelector('#id_img').addEventListener('change', function() {
        const fileName = this.files[0].name;
        const truncatedFileName = fileName.length > 20 ? `${fileName.slice(0, 10)}...${fileName.slice(-10)}` : fileName;
        document.querySelector('#fileName').textContent = truncatedFileName;
        document.querySelector('#noFile').textContent = truncatedFileName;
    });

    function getLast30Days() {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return days;
    }

    function getCryptoInfo() {
        toggleSpinners(true);

        ajaxRequest('GET', '/getCryptoDetails/', null, response => {
            if (response.success) {
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
            document.querySelector(`.percentage-down-up.${crypto.class}`).textContent = `%${crypto.value[1].toFixed(2)}`;
            document.querySelector(`.price-v.${crypto.class}`).textContent = `$${crypto.value[0]}`;
        });
    }

    function toggleSpinners(show) {
        ['btc', 'eth', 'ltc'].forEach(crypto => {
            document.querySelector(`.${crypto}-spinner`).style.display = show ? 'block' : 'none';
            document.querySelector(`.price-v.${crypto}`).style.display = show ? 'none' : 'block';
        });
    }

    function updateDashboard() {
        ajaxRequest('GET', '/getDashboard/', null, response => {
            if (response.success) {
                const { balance, objectif, profits, losses, profits_percentage, losses_percentage } = response.dashboard;
                document.querySelector('.balance').textContent = `$${balance}`;
                document.querySelector('.objectif').textContent = `$${objectif}`;
                document.querySelector('.profits').textContent = `+$${profits}`;
                document.querySelector('.losses').textContent = `-$${losses}`;
                document.querySelector('.icons-up-green').textContent = `%${profits_percentage}`;
                document.querySelector('.icons-up-red').textContent = `-%${losses_percentage}`;
                myChart.update();
            }
        }, null, true, "Update dashboard", UpdateChart);
    }

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
        }, null, true, "Update transactions", null);
    }

    function UpdateChart() {
        document.getElementById('chartLoader').style.display = 'flex';
        ajaxRequest("POST", "/get_dashboard_log/", null, response => {
            if (response && response.log_list && response.log_list.length > 0) {
                myChart.data.datasets[0].data = response.log_list.map(log => log[0]).reverse();
                myChart.data.labels = response.log_list.map(log => log[1]).reverse();
                myChart.update();
            }
            document.getElementById('chartLoader').style.display = 'none';
        }, null, true, "get dashboard log", null);
    }

    function getNoTransactionsHTML() {
        return `
            <div class="no-transactions-message">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                    <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,2c-7.2878,0 -13.78519,3.40209 -18,8.69922v-6.69922c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v10h10c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-6.48047c3.84527,-4.86929 9.78778,-8 16.48047,-8c11.60953,0 21,9.39047 21,21c0,11.60953 -9.39047,21 -21,21h-0.00977h-1v0.91602c-0.0046,0.05524 -0.0046,0.11077 0,0.16602v0.91797h1c0.00326,0.00002 0.00651,0.00002 0.00977,0h1v-0.02539c12.22684,-0.52549 22,-10.61976 22,-22.97461c0,-12.69047 -10.30953,-23 -23,-23zM24,11v3.05273c-1.732,0.168 -3.13859,0.78089 -4.18359,1.83789c-1.826,1.847 -1.81741,4.34936 -1.81641,4.44336c0,4.302 3.7612,5.13855 6.7832,5.81055c3.235,0.717 5.2168,1.28847 5.2168,3.85547c0,3.93 -4.798,3.999 -5,4c-4.809,0 -4.995,-3.59781 -5,-4.00781l-1,0.00781h-1c0,1.944 1.284,5.51013 6,5.95313v3.04688h2v-3.06445c2.498,-0.306 6,-1.78455 6,-5.93555c0,-4.302 -3.7612,-5.13855 -6.7832,-5.81055c-3.235,-0.717 -5.2168,-1.28928 -5.2168,-3.86328c0,-0.011 0.00577,-1.14542 0.63477,-2.23242c0.803,-1.389 2.27223,-2.09375 4.36523,-2.09375c3.805,0 3.991,3.60472 4,4.01172l2,-0.02539c-0.024,-1.914 -1.132,-5.39902 -5,-5.91602v-3.07031zM2,24v1v0.01172v1h2v-1v-0.01172v-1zM4.09766,27.62305l-1.95508,0.42383l0.21094,0.97656l0.00391,0.01953l0.21094,0.97656l1.95508,-0.42187l-0.21094,-0.97852l-0.00391,-0.01758zM4.88477,31.21484l-1.85742,0.74219l0.36914,0.92773l0.00781,0.01953l0.37109,0.92773l1.85742,-0.74023l-0.37109,-0.92969l-0.00781,-0.01758zM6.29102,34.61328l-1.71289,1.0332l0.51758,0.85742l0.00977,0.01563l0.51758,0.85547l1.71094,-1.0332l-0.51562,-0.85547l-0.00977,-0.01758zM8.26758,37.71289l-1.52344,1.29492l0.64648,0.76172l0.01367,0.01563l0.64648,0.76172l1.52539,-1.29492l-0.64844,-0.76172l-0.01172,-0.01562zM10.75,40.42383l-1.29883,1.52148l0.76172,0.64844l0.01367,0.01367l0.76172,0.64844l1.29883,-1.52148l-0.76172,-0.64844l-0.01367,-0.01367zM13.66016,42.66602l-1.03711,1.70898l0.85547,0.51953l0.01563,0.00977l0.85547,0.51758l1.03711,-1.70898l-0.85547,-0.51953l-0.01562,-0.00977zM16.91016,44.36719l-0.74414,1.85742l0.92773,0.37109l0.01758,0.00781l0.92773,0.37305l0.74414,-1.85742l-0.92773,-0.37109l-0.01758,-0.00781zM20.4043,45.47656l-0.42773,1.95313l0.97656,0.21484l0.01953,0.00391l0.97656,0.21289l0.42773,-1.95312l-0.97656,-0.21484l-0.01953,-0.00391z"></path></g></g>
                </svg>
                No transactions have been added.
            </div>
        `;
    }

    function getTransactionHTML(transaction) {
        const amountClass = transaction.type === 'profit' ? 'profit-background' : 'loss-background';
        const auntClass = transaction.type === 'profit' ? 'transaction-info-text' : 'transaction-info-text-loss';
        // const badgesHTML = transaction.badges.map(badge => `<img class="profile-user-badges" src="${badge.icon}" alt="${badge.title}">`).join('');

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
                            ${transaction.pair} <span class="transaction-info-text ${auntClass}">${transaction.type}</span>
                        </span>
                    </div>
                    <div class="transaction-amount-container ${amountClass}">
                        <span class="amount-trade">${transaction.amount} $</span>
                    </div>
                </div>
            </div>
        `;
    }

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

    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(message => message.textContent = '');
    }

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

    $('.openmodale').click(e => {
        e.preventDefault();
        $('.modale').addClass('opened');
    });

    $('.closemodale').click(e => {
        e.preventDefault();
        $('.modale').removeClass('opened');
    });

    $('#chooseFile').bind('change', function() {
        const filename = $("#chooseFile").val();
        if (/^\s*$/.test(filename)) {
            $(".file-upload").removeClass('active');
            $("#noFile").text("No file chosen...");
        } else {
            $(".file-upload").addClass('active');
            $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
        }
    });
});
