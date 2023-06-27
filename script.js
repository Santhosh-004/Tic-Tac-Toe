const btnEl = document.querySelector('#game-board')
console.log(btnEl)
const againRl = document.querySelector('#again')

let play = true

const char = ['X', 'O']
let count = 0
let board = [['', '', ''],
            ['', '', ''],
            ['', '', '']]


btnEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('b-btn')) {
        change_val(event.target)
    }
})

var check_pos = (place) => {
    if (place.innerHTML === '') {
        return true
    }
    return false
}

var change_val = (place) => {
    if (check_pos(place) && play) {
        place.innerHTML = char[count++ % 2]
        board[Math.floor((place.getAttribute('aria-placeholder')-1)/3)][(place.getAttribute('aria-placeholder')-1) % 3] = char[(count-1) % 2]
    }
    console.log(board)

    if (count > 4) {
        console.log(document.querySelector('.playAgain'))
        if (check_win(board)) {
            document.querySelector('.show-winner').innerHTML = `<h1>Winner: ${char[(count-1) % 2]} </h1>`
            document.querySelector('.playAgain').style.display='inline'
            count = 0
            play = false
        }
    }

    if (count == 9) {
        document.querySelector('.show-winner').innerHTML = `<h1>Draw </h1>`
        document.querySelector('.playAgain').style.display='inline'
        count = 0
        play = false
    }
}

var check_win = (board) => {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
            console.log('here')
            return true
        }
    }
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
            console.log('here2')
            return true
        }
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        console.log('here3')
        return true
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
        console.log('here4')
        console.log(board[0][0])
        console.log('see here', board[0][2], board[1][1], board[2][0])
        return true
    }
    return false
}

againRl.addEventListener('click', ()=> {
    board = [['', '', ''],
            ['', '', ''],
            ['', '', '']]
    play = true
    board_render(board)
})

function board_render(board) {
    const cells = document.querySelectorAll('.b-btn')

    cells.forEach((element, index) => {
        let row = Math.floor(index / 3)
        let col = index % 3
        element.textContent = board[row][col] 
    });
    document.querySelector('.show-winner').innerHTML = ''
    document.querySelector('.playAgain').style.display = 'none'
}