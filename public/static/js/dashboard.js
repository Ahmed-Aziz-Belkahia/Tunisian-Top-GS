var first_load = true;

// Generate labels for the last 30 days
function getLast30Days() {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return days;
}

const shadowPlugin = {
    id: 'shadowPlugin',
    afterDatasetsDraw: function(chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function(dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function(element) {
                    // Draw the shadow under each point
                    ctx.fillStyle = '#056d93'; // Shadow color
                    ctx.shadowColor = '#056d93'; // Same color as the line
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
};

// Custom plugin to change line color based on y-value
const colorChangePlugin = {
    id: 'colorChangePlugin',
    beforeDatasetsDraw: function(chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function(dataset) {
            var meta = chart.getDatasetMeta(0);
            ctx.save();
            ctx.lineWidth = dataset.borderWidth;

            for (let i = 0; i < meta.data.length - 1; i++) {
                const curr = meta.data[i];
                const next = meta.data[i + 1];

                if (curr.parsed && next.parsed) {
                    ctx.beginPath();
                    ctx.moveTo(curr.x, curr.y);
                    ctx.lineTo(next.x, next.y);

                    // Determine color based on y-value
                    if (curr.parsed.y >= 0) {
                        ctx.strokeStyle = 'green';
                    } else {
                        ctx.strokeStyle = 'red';
                    }

                    ctx.stroke();
                }
            }
            
            ctx.restore();
        });
    }
};

// Register the plugins
Chart.register(shadowPlugin, colorChangePlugin);

// Generate labels for the last 30 days
const labels = getLast30Days();

// Generate sample data for the last 30 days
const data = [];

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Total Balance',
            data: data,
            borderColor: '#a45cf6',
            borderWidth: 3.3,
            lineTension: 0.55, // Set the tension for a wavy effect
            fill: true,
            backgroundColor: 'rgba(164, 92, 246, 0.09)', // Gradient fill under the line
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
                    font: {
                        family: 'Poppins' // Poppins font for legend labels
                    }
                }
            },
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        // Return the day for the tooltip title
                        return tooltipItems[0].label;
                    },
                    label: function(context) {
                        var label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + ' $';
                        }
                        return label;
                    }
                },
                enabled: true,
                mode: 'index',
                intersect: false,
                bodyFont: {
                    family: 'Poppins' // Poppins font for tooltips
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: '#f5f5f521',
                },
                ticks: {
                    color: '#ffffff',
                    callback: function(value) {
                        return value + ' $';
                    },
                    font: {
                        family: 'Poppins' // Poppins font for y-axis labels
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0)',
                    borderColor: 'rgba(255, 255, 255, 1)'
                },
                ticks: {
                    color: '#f5f5f521',
                    font: {
                        family: 'Poppins' // Poppins font for x-axis labels
                    }
                }
            }
        }
    }
});

function get_crypto_info() {
    // Show the spinners and hide the price values
    document.querySelector('.btc-spinner').style.display = 'block';
    document.querySelector('.eth-spinner').style.display = 'block';
    document.querySelector('.ltc-spinner').style.display = 'block';
    document.querySelector('.price-v.btc').style.display = 'none';
    document.querySelector('.price-v.eth').style.display = 'none';
    document.querySelector('.price-v.ltc').style.display = 'none';

    ajaxRequest('GET', '/getCryptoDetails/', null, function(response) {
        if (response.success) {
            var btc = response.crypto_details.btc;
            var eth = response.crypto_details.eth;
            var sol = response.crypto_details.sol;

            var lossesPercentageBtcElement = document.querySelector('.percentage-down-up.btc');
            var lossesPercentageEthElement = document.querySelector('.percentage-down-up.eth');
            var lossesPercentageSolElement = document.querySelector('.percentage-down-up.ltc');
            var lossesBtcElement = document.querySelector('.price-v.btc');
            var lossesEthElement = document.querySelector('.price-v.eth');
            var lossesSolElement = document.querySelector('.price-v.ltc');

            lossesPercentageBtcElement.textContent = '%' + btc[1].toFixed(2);
            lossesPercentageEthElement.textContent = '%' + eth[1].toFixed(2);
            lossesPercentageSolElement.textContent = '%' + sol[1].toFixed(2);
            lossesBtcElement.textContent = '$' + btc[0];
            lossesEthElement.textContent = '$' + eth[0];
            lossesSolElement.textContent = '$' + sol[0];

            // Hide the spinners and show the price values
            document.querySelector('.btc-spinner').style.display = 'none';
            document.querySelector('.eth-spinner').style.display = 'none';
            document.querySelector('.ltc-spinner').style.display = 'none';
            document.querySelector('.price-v.btc').style.display = 'block';
            document.querySelector('.price-v.eth').style.display = 'block';
            document.querySelector('.price-v.ltc').style.display = 'block';
        }
    }, null, true, "Update crypto", function() {
        if (first_load) {
            first_load = false;
            
        }
    });
}

function updateDashboard() {
    ajaxRequest('GET', '/getDashboard/', null, function(response) {
        if (response.success) {
            var newBalance = response.dashboard.balance;
            var newObjectif = response.dashboard.objectif;
            var newProfits = response.dashboard.profits;
            var newLosses = response.dashboard.losses;
            var newProfitsPercentage = response.dashboard.profits_percentage;
            var newLossesPercentage = response.dashboard.losses_percentage;

            var balanceElement = document.querySelector('.balance');
            var objectifElement = document.querySelector('.objectif');
            var profitsElement = document.querySelector('.profits');
            var lossesElement = document.querySelector('.losses');
            var profitsPercentageElement = document.querySelector('.icons-up-green');
            var lossesPercentageElement = document.querySelector('.icons-up-red');

            balanceElement.textContent = '$' + newBalance;
            objectifElement.textContent = '$' + newObjectif;
            profitsElement.textContent = '+$' + newProfits;
            lossesElement.textContent = '-$' + newLosses;
            profitsPercentageElement.textContent = '%' + newProfitsPercentage;
            lossesPercentageElement.textContent = '-%' + newLossesPercentage;
            myChart.update();
        }
    }, null, true, "Update dashboard", function (r) {
        UpdateChart();
    });
}

function updateTransactions() {
    
    var transactionHistoryElement = document.querySelector('.transactions-history');
    ajaxRequest('GET', '/getTransactions/', null, function(response) {
        if (response.success) {
            transactionHistoryElement.innerHTML = '';

            if (response.transactions.length === 0) {
                var noTransactionsHTML = `
                    <div class="no-transactions-message">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                                <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,2c-7.2878,0 -13.78519,3.40209 -18,8.69922v-6.69922c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v10h10c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-6.48047c3.84527,-4.86929 9.78778,-8 16.48047,-8c11.60953,0 21,9.39047 21,21c0,11.60953 -9.39047,21 -21,21h-0.00977h-1v0.91602c-0.0046,0.05524 -0.0046,0.11077 0,0.16602v0.91797h1c0.00326,0.00002 0.00651,0.00002 0.00977,0h1v-0.02539c12.22684,-0.52549 22,-10.61976 22,-22.97461c0,-12.69047 -10.30953,-23 -23,-23zM24,11v3.05273c-1.732,0.168 -3.13859,0.78089 -4.18359,1.83789c-1.826,1.847 -1.81741,4.34936 -1.81641,4.44336c0,4.302 3.7612,5.13855 6.7832,5.81055c3.235,0.717 5.2168,1.28847 5.2168,3.85547c0,3.93 -4.798,3.999 -5,4c-4.809,0 -4.995,-3.59781 -5,-4.00781l-1,0.00781h-1c0,1.944 1.284,5.51013 6,5.95313v3.04688h2v-3.06445c2.498,-0.306 6,-1.78455 6,-5.93555c0,-4.302 -3.7612,-5.13855 -6.7832,-5.81055c-3.235,-0.717 -5.2168,-1.28928 -5.2168,-3.86328c0,-0.011 0.00577,-1.14542 0.63477,-2.23242c0.803,-1.389 2.27223,-2.09375 4.36523,-2.09375c3.805,0 3.991,3.60472 4,4.01172l2,-0.02539c-0.024,-1.914 -1.132,-5.39902 -5,-5.91602v-3.07031zM2,24v1v0.01172v1h2v-1v-0.01172v-1zM4.09766,27.62305l-1.95508,0.42383l0.21094,0.97656l0.00391,0.01953l0.21094,0.97656l1.95508,-0.42187l-0.21094,-0.97852l-0.00391,-0.01758zM4.88477,31.21484l-1.85742,0.74219l0.36914,0.92773l0.00781,0.01953l0.37109,0.92773l1.85742,-0.74023l-0.37109,-0.92969l-0.00781,-0.01758zM6.29102,34.61328l-1.71289,1.0332l0.51758,0.85742l0.00977,0.01563l0.51758,0.85547l1.71094,-1.0332l-0.51562,-0.85547l-0.00977,-0.01758zM8.26758,37.71289l-1.52344,1.29492l0.64648,0.76172l0.01367,0.01563l0.64648,0.76172l1.52539,-1.29492l-0.64844,-0.76172l-0.01172,-0.01562zM10.75,40.42383l-1.29883,1.52148l0.76172,0.64844l0.01367,0.01367l0.76172,0.64844l1.29883,-1.52148l-0.76172,-0.64844l-0.01367,-0.01367zM13.66016,42.66602l-1.03711,1.70898l0.85547,0.51953l0.01563,0.00977l0.85547,0.51758l1.03711,-1.70898l-0.85547,-0.51953l-0.01562,-0.00977zM16.91016,44.36719l-0.74414,1.85742l0.92773,0.37109l0.01758,0.00781l0.92773,0.37305l0.74414,-1.85742l-0.92773,-0.37109l-0.01758,-0.00781zM20.4043,45.47656l-0.42773,1.95313l0.97656,0.21484l0.01953,0.00391l0.97656,0.21289l0.42773,-1.95312l-0.97656,-0.21484l-0.01953,-0.00391z"></path></g></g>
                                </svg>
                        No transactions have been added.
                    </div>
                `;
                transactionHistoryElement.insertAdjacentHTML('beforeend', noTransactionsHTML);
            } else {
                for (let i = 0; i < Math.min(4, response.transactions.length); i++) {
                    let transaction = response.transactions[i];
                    // Assign class based on transaction type
                    var amountClass = transaction.type === 'profit' ? 'profit-background' : 'loss-background';
                    var auntClass = transaction.type === 'profit' ? 'transaction-info-text' : 'transaction-info-text-loss';

                    // Build HTML for badges
                    var badgesHTML = '';
                    transaction.badges.forEach(function(badge) {
                        badgesHTML += `<img class="profile-user-badges" src="${badge.icon}" alt="${badge.title}">`;
                    });

                    var transactionHTML = `
                        <div class="history-user-transc">
                            <div class="ianloine">
                                <div class="profile-picture-container">
                                    <img class="profile-user-transaction" src="${transaction.pfp}" alt="">
                                </div>
                                <div class="informations-user">
                                    <div class="name-fser">
                                        <span class="foll">${transaction.user}</span>
                                        ${badgesHTML} <!-- Render badges here -->
                                    </div>
                                    <div class="date-badges">
                                        ${transaction.date}
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
                    transactionHistoryElement.insertAdjacentHTML('beforeend', transactionHTML);
                }
            }
        }
    }, null, true, "Update transactions", null);
}

function UpdateChart() {
    // Show the loader
    var chartLoader = document.getElementById('chartLoader');
    chartLoader.style.display = 'flex';

    ajaxRequest("POST", "/get_dashboard_log/", null, function(response) {
        if (response && response.log_list && response.log_list.length > 0) {
            var balance_logs = response.log_list.map(log => log[0]);
            var date_logs = response.log_list.map(log => log[1]);
    
            myChart.data.datasets[0].data = balance_logs.reverse();
            myChart.data.labels = date_logs.reverse();
    
            myChart.update();
        }
        // Hide the loader
        chartLoader.style.display = 'none';
    }, null, true, "get dashboard log", null);
}

updateDashboard();
updateTransactions();
UpdateChart();
get_crypto_info();
