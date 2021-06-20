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

const generateDrewPoints = netWorthOrderByDate => {
    // TODO: 
}


(async () => {
    const CONST_RATE = await fetchData('./data/const_rate.json')
    const CONST_TRANSACTIONS = await fetchData('./data/transaction_history.json')

    const {transactionsOrderByDate, netWorthOrderByDate} = processTransactions(CONST_TRANSACTIONS, CONST_RATE)

    // TODO: debug
    console.log({transactionsOrderByDate, netWorthOrderByDate})
})();


/*
window.onload = function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Net Worth"
        },
        axisX: {
            valueFormatString: "DD MMM"
        },
        axisY: {
            title: "Number of Visitors",
            scaleBreaks: {
                autoCalculate: true
            }
        },
        data: [{
            type: "line",
            xValueFormatString: "DD MMM",
            color: "#F08080",
            dataPoints: [
                { x: new Date(2017, 0, 1), y: 610 },
                { x: new Date(2017, 0, 2), y: 680 },
                { x: new Date(2017, 0, 3), y: 690 },
                { x: new Date(2017, 0, 4), y: 700 },
                { x: new Date(2017, 0, 5), y: 710 },
                { x: new Date(2017, 0, 6), y: 658 },
                { x: new Date(2017, 0, 7), y: 734 },
                { x: new Date(2017, 0, 8), y: 963 },
                { x: new Date(2017, 0, 9), y: 847 },
                { x: new Date(2017, 0, 10), y: 853 },
                { x: new Date(2017, 0, 11), y: 869 },
                { x: new Date(2017, 0, 12), y: 943 },
                { x: new Date(2017, 0, 13), y: 970 },
                { x: new Date(2017, 0, 14), y: 869 },
                { x: new Date(2017, 0, 15), y: 890 },
                { x: new Date(2017, 0, 16), y: 930 },
                { x: new Date(2017, 0, 17), y: 1850 },
                { x: new Date(2017, 0, 18), y: 1905 },
                { x: new Date(2017, 0, 19), y: 1980 },
                { x: new Date(2017, 0, 20), y: 1858 },
                { x: new Date(2017, 0, 21), y: 1034 },
                { x: new Date(2017, 0, 22), y: 963 },
                { x: new Date(2017, 0, 23), y: 847 },
                { x: new Date(2017, 0, 24), y: 853 },
                { x: new Date(2017, 0, 25), y: 869 },
                { x: new Date(2017, 0, 26), y: 943 },
                { x: new Date(2017, 0, 27), y: 970 },
                { x: new Date(2017, 0, 28), y: 869 },
                { x: new Date(2017, 0, 29), y: 890 },
                { x: new Date(2017, 0, 30), y: 930 },
                { x: new Date(2017, 0, 31), y: 750 }
            ]
        }]
    });
    chart.render();

}
*/