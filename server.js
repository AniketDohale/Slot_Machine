// 1. Deposit Some Money
// 2. Determine the Number of Lines to Bet on
// 3. Collect a Bet Amount
// 4. Spin the Slot Machine
// 5. Check if the User Won
// 6. Give the User their Winnings
// 7. Play Again

const prompt = require('prompt-sync')()

const ROWS = 3
const COLS = 3

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8,
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
}

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a Deposit Amount: ")
        // console.log(depositAmount)
        const numberDepositAmount = parseFloat(depositAmount)

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid Deposit Amount, Please Try Again..")
        }
        else {
            return numberDepositAmount
        }
    }
}

const getNumberofLines = () => {
    while (true) {
        const lines = prompt("Enter the Number of lines to Bet on (1-3): ")
        const noOfLines = parseFloat(lines)

        if (isNaN(noOfLines) || noOfLines <= 0 || noOfLines > 3) {
            console.log("Inavalid Number of Lines, Please Try Again..")
        }
        else {
            return noOfLines
        }
    }

}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter Bet per Line: ")
        const numberBet = parseFloat(bet)

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid Bet, Please Try Again..")
        }
        else {
            return numberBet
        }
    }
}

const spin = () => {
    const symbols = []
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        // console.log(symbol, count)
        for (let i = 0; i < count; i++) {
            symbols.push(symbol)
        }
    }
    // console.log(symbols)
    const reels = []
    for (let i = 0; i < COLS; i++) {
        reels.push([])
        const reelSymbols = [...symbols]
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex]
            reels[i].push(selectedSymbol)
            reelSymbols.splice(randomIndex, 1)
        }
    }
    return reels
}

const transpose = (reels) => {
    const rows = []
    for (let i = 0; i < ROWS; i++) {
        rows.push([])
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = ""
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row]
        let allSame = true

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false
                break
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings
}

const game = () => {
    let balance = deposit()
    // console.log(amount)

    while (true) {
        console.log("You have a balance of $" + balance)

        const lines = getNumberofLines()
        // console.log(lines)

        const bet = getBet(balance, lines)
        // console.log(bet)

        balance -= bet * lines

        const reels = spin()

        const rows = transpose(reels)
        printRows(rows)
        const winnings = getWinnings(rows, bet, lines)
        balance += winnings
        console.log("You Won, $" + winnings.toString())

        if (balance <= 0) {
            console.log("You Ran Out of Money!")
            break
        }
        const playAgain = prompt("Do you want to Play Again (Y/N) ")
        if (playAgain != "Y") break
    }
}

game()