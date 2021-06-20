const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const calculateNetWorth = (accountBalances, rate) => {
    return accountBalances.cad + accountBalances.btc * rate.BTC_CAD + accountBalances.eth * rate.ETH_CAD
}

const processTransactions = (transactions, rate) => {
    transactions = transactions.reverse()
    let accountBalances = {
        cad: 0,
        btc: 0,
        eth: 0,
    }
    let transactionsOrderByDate = {}
    let netWorthOrderByDate = {}

    for (transaction of transactions) {
        const date = transaction.createdAt.substring(0, 10)
        if (!transactionsOrderByDate.hasOwnProperty(date)) {
            transactionsOrderByDate[date] = [];
        }
        transactionsOrderByDate[date].push(transaction);
        processTransaction(accountBalances, transaction)
        netWorthOrderByDate[date] = calculateNetWorth(accountBalances, rate)
    }

    return {
        transactionsOrderByDate,
        netWorthOrderByDate,
    }
}

const processTransaction = (accountBalances, transaction) => {
    const account = transaction.currency.toLowerCase()
    const amount = transaction.amount

    if (transaction.direction === 'credit') {
        accountBalances[account] += amount

        // TODO: debug
        if (account === 'btc') {
            console.log(transaction.createdAt + ' / BTC credit+++++: ' + amount + ', BTC total: ' + accountBalances.btc);
        }

    } else if (transaction.direction === 'debit') {
        accountBalances[account] -= amount

        // TODO: debug
        if (account === 'btc') {
            console.log(transaction.createdAt + ' / BTC debit----- ' + amount + ', BTC total: ' + accountBalances.btc);
        }
    } else {
        const fromAccount = transaction.from.currency.toLowerCase()
        const fromAmount = transaction.from.amount
        const toAccount = transaction.to.currency.toLowerCase()
        const toAmount = transaction.to.amount
        accountBalances[fromAccount] -= fromAmount
        accountBalances[toAccount] += toAmount
    }
}

const generateDataPoints = netWorthOrderByDate => {
    const points = []
    for (const [date, netWorth] of Object.entries(netWorthOrderByDate)) {
        points.push({
            x: new Date(date + 'T23:59:49.137Z'),
            y: Math.round(netWorth * 100) / 100,
        })
    }

    return points
}

const drawChart = dataPoints => {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Net Worth"
        },
        axisX: {
            valueFormatString: "YYYY/MM/DD"
        },
        axisY: {
            title: "Canada Dollard ($)",
            scaleBreaks: {
                autoCalculate: true
            }
        },
        data: [{
            type: "line",
            xValueFormatString: "YYYY/MM/DD",
            color: "blue",
            dataPoints,
        }]
    });
    chart.render();
}


(async () => {
    const CONST_RATE = await fetchData('./data/const_rate.json')
    const CONST_TRANSACTIONS = await fetchData('./data/transaction_history.json')

    const {transactionsOrderByDate, netWorthOrderByDate} = processTransactions(CONST_TRANSACTIONS, CONST_RATE)

    // TODO: debug
    console.log({transactionsOrderByDate, netWorthOrderByDate})

    drawChart(generateDataPoints(netWorthOrderByDate))
})();