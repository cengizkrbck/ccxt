"use strict";

const ccxt = require ('../ccxt.js')

;(async function main () {

    const exchange_cengiz2 = new ccxt.binance ({ //cengiz
        'apiKey': 'o3pXYxRGU6gby3lqiVroz14wEQ70mQQw9qD4qbiEpKnolSEn2YJpHi64FCB1xrJ6',
        'secret': 'tObboVWYRa2tzdzHt2YUxof3FRQvcsiLYuXmxGsyKbUy7rI9DoGLUP0qIbivZatb',
        'enableRateLimit': true,
    })

    const exchange_cengiz = new ccxt.binance ({ //emin
        'apiKey': 'zUEl9W5FZIEj8SH69o2dyWBTtGXNRbwi399N1oI92XQwKCZxWLO2wAMxzWQrF4NU',
        'secret': 'CKDS8L7eRGaXrGlDquo7rfxsR5htlA6rUSN5H13Kxbw38EseZ030EhRxIuhXA9j0',
        'enableRateLimit': true,
    })

    await exchange_cengiz.loadMarkets ()

    // exchange.verbose = true // uncomment for debugging

    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    let startTime = exchange_cengiz.parse8601 ('2020-01-01T00:00:00')
    const now = exchange_cengiz.milliseconds ()
    const currencyCode = undefined // any currency

    let allTransactions = []

    while (startTime < now) {

        const endTime = startTime + ninetyDays

        const transactions = await exchange_cengiz.fetchDeposits (currencyCode, startTime, undefined, {
            'endTime': endTime,
        })
        if (transactions.length) {
            const lastTransaction = transactions[transactions.length - 1]
            startTime = lastTransaction['timestamp'] + 1
            allTransactions = allTransactions.concat (transactions)
        } else {
            startTime = endTime;
        }
    }

    console.log ('Fetched', allTransactions.length, 'transactions')
    for (let i = 0; i < allTransactions.length; i++) {
        const transaction = allTransactions[i]
        console.log(transaction)
        console.log (i, transaction['datetime'], transaction['txid'], transaction['currency'], transaction['amount'])
    }

    console.log()
}) ()