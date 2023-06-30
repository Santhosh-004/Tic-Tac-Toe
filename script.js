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
let key, key_c = 0, play_c = 0
let player
const char = ['X', 'O']
const bool = [true, false]
let count = 0
let board = [['', '', ''],
            ['', '', ''],
            ['', '', '']]

let allData


async function insert_values(id) {
    const result = await set(ref(db, `${id}/one`), {
        count: count,
        board: board,
        joined: false,
        play_now: play
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

async function update_values(id, tjoined) {
    await show_values(id)
    if (allData != null) {
        const result = await update(ref(db, `${id}/one`), {
            count: count,
            board: board,
            joined: tjoined,
            play_now: play
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
    player = 0
    play = true
    await create_id(random)
    await show_values(random)
    key = char[key_c%2]
    console.log(play, key)

    var loop = setInterval(()=>{
        console.log('checking', allData.joined)
        chk_player(random)
        if (allData.joined === true) {
            console.log('here')
            console.log(allData.joined)
            clearInterval(loop)
            document.querySelector('#game-board').style.display = 'flex'
            document.querySelector('#showId').style.display = 'none'
        }
    }, 1000)   
    
    var one_loop = setInterval(async()=>{
        await show_values(random)
        render(allData.board)
        if (allData.play_now == false) {
            play = true
        }
    }, 1000)

})

document.querySelector('#eIdBtn').addEventListener('click', (event) => {
    document.querySelector('#conBtn').style.display = 'none'
    document.querySelector('#enterId').style.display = 'flex'
    player = 1
    play = false
    key = char[++key_c%2]
    console.log(play, key)
})

document.querySelector('#playBtn').addEventListener('click', async(event) => {
    let id = document.querySelector('#id').value
    join_game(id)
    await show_values(id)
    setInterval(async()=>{
        console.log('loop2', play, allData)
        await show_values(random)
        render(allData.board)
        if (allData.play_now == false) {
            play = true
        }
    }, 1000)
})


btnEl.addEventListener('click', async(event) => {
    await show_values(random)
    render(allData.board)
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
    const cells = document.querySelectorAll('.b-btn')
    console.log('came to render', board)
    cells.forEach((element, index) => {
        let row = Math.floor(index / 3)
        let col = index % 3
        element.textContent = board[row][col]
        console.log(board[row][col])
    });
}

var eye_on_two = (id) => {
    if (player == 2) {
        setTimeout(() => {
            
        })
    }
}

var change_val = async(place) => {
    await show_values(random)
    board = allData.board
    if (check_pos(place) && play && online == false) {
        place.innerHTML = char[count++ % 2]
        board[Math.floor((place.getAttribute('aria-placeholder')-1)/3)][(place.getAttribute('aria-placeholder')-1) % 3] = char[(count-1) % 2]
    } else if (check_pos(place) && play && online) {
        place.innerHTML = key
        board[Math.floor((place.getAttribute('aria-placeholder')-1)/3)][(place.getAttribute('aria-placeholder')-1) % 3] = key
        play = false
        count++
        console.log('before update', allData)
        await update_values(random, true)
        console.log('after update', allData)

    }

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
    render(board)
    document.querySelector('.show-winner').innerHTML = ''
    document.querySelector('.playAgain').style.display = 'none'
}