// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFg-6kVCFG6s8TbOFxuxVT5VD2cCCU-a8",
  authDomain: "tic-tac-toe-70714.firebaseapp.com",
  projectId: "tic-tac-toe-70714",
  storageBucket: "tic-tac-toe-70714.appspot.com",
  messagingSenderId: "145077820985",
  appId: "1:145077820985:web:6b0c5e27e01ac1aa82f7e8"
};
const app = initializeApp(firebaseConfig);

let db = getDatabase(app);
let random = Math.floor(Math.random()*1000);
if (random < 100) {
    random += 100
}

random = 101

const btnEl = document.querySelector('#game-board')
const againRl = document.querySelector('#again')

let play = true
let online = false
let player
const char = ['X', 'O']
let count = 0
let board = [['', '', ''],
            ['', '', ''],
            ['', '', '']]

let allData


async function insert_values(id) {
    const result = await set(ref(db, `${id}/one`), {
        count: count,
        board: board,
        joined: false
    })
}

async function show_values(id) {
    let dbref = ref(db);
    const snapshot = await get(child(dbref, `${id}/one`))
    if (snapshot.exists()) {
        /* console.log('from cloud', snapshot.val()) */
        allData = snapshot.val()
    } else {
        /* console.log("No data available") */
        allData = null
    }
}

async function update_values(id, joined) {
    await show_values(id)
    if (allData != null) {
        const result = await update(ref(db, `${id}/one`), {
            count: count,
            board: board,
            joined: joined
        })
    }
}

document.querySelector('#online').addEventListener('click', (event) => {
    document.querySelector('#choose').style.display = 'none'
    document.querySelector('#connection').style.display = 'inline'
    online = true
})

document.querySelector('#offline').addEventListener('click', (event) => {
    document.querySelector('#game-board').style.display = 'flex'
    document.querySelector('#choose').style.display = 'none'
})

document.querySelector('#sIdBtn').addEventListener('click', async(event) => {
    document.querySelector('#conBtn').style.display = 'none'
    document.querySelector('#showId').style.display = 'inline'
    player = 1
    await create_id(random)
    await show_values(random)
    

    setInterval(()=>{
        console.log('checking', allData.joined)
        chk_player(random)
    }, 1000)

    if (allData.joined == true) {
        console.log(allData.joined)
        document.querySelector('#game-board').style.display = 'flex'
        document.querySelector('#showId').style.display = 'none'
    }

    
})

document.querySelector('#eIdBtn').addEventListener('click', (event) => {
    document.querySelector('#conBtn').style.display = 'none'
    document.querySelector('#enterId').style.display = 'flex'
    player = 2
})

document.querySelector('#playBtn').addEventListener('click', (event) => {
    let id = document.querySelector('#id').value
    join_game(id)
})


btnEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('b-btn')) {
        change_val(event.target)
    }
})

var create_id = async (id) => {
    console.log('started')
    document.querySelector('#process').textContent = 'Creating Room...'
    await insert_values(id)
    await show_values(id)
    console.log(allData)
    document.querySelector('#showHere').textContent += id
    document.querySelector('#process').textContent = 'Done'
    document.querySelector('#wait').textContent = 'Waiting for the other player to join...'
}

var chk_player = async (id) => {
    await show_values(id)
    if (allData.joined == true) {
        document.querySelector('#wait').textContent = 'Entering the game'
        setTimeout(() => {
            document.querySelector('#showId').style.display = 'none'
        }, 1000)
    }
}

var join_game = async(id) => {
    document.querySelector('#join').textContent = 'Joining...'
    await update_values(id, true)
    if (allData != null) {
        setTimeout(() => {
            document.querySelector('#join').textContent = 'Connected!'
        }, 1000)
        document.querySelector('#enterId').style.display = 'none'
        document.querySelector('#game-board').style.display = 'flex'
    } else {
        document.querySelector('#join').textContent = "Room doesn't Exist"
    }

}

var check_pos = (place) => {
    if (place.innerHTML === '') {
        return true
    }
    return false
}

var render = (board) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.querySelector(`[aria-placeholder='${i * 3 + j + 1}']`).innerHTML = board[i][j]
        }
    }
}

var change_val = (place) => {
    if (check_pos(place) && play) {
        place.innerHTML = char[count++ % 2]
        board[Math.floor((place.getAttribute('aria-placeholder')-1)/3)][(place.getAttribute('aria-placeholder')-1) % 3] = char[(count-1) % 2]
    }
    console.log('local', board)

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