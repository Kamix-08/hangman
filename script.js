const word_base_url = "https://raw.githubusercontent.com/first20hours/google-10000-english/refs/heads/master/google-10000-english-usa-no-swears-medium.txt"

const img_container = document.querySelector('#img')
const word_tag = document.querySelector('#word')
const letters_tag = document.querySelector('#letters')

let word_list

(async function fetch_word_list() {
    word_list = await fetch(word_base_url)
        .then(res => res.text())
        .then(res => res.split('\n'))

    new_game()
})()

const letters_left = []
const letters_used = []
let letters_left_count = 0

let lives = 0
let ended = false

function clear() {
    img_container.innerHTML = '<img src="./../img/00.png" alt="00"></img>'
    word_tag.textContent = ''
    letters_tag.textContent = ''

    letters_left.length = 0
    letters_used.length = 0
    letters_left_count = 0

    lives = 10
}

function new_game() {
    clear()

    if(!word_list) {
        alert("Failed to fetch word list...")
        return
    }

    const word = word_list[Math.floor(Math.random() * word_list.length)].trim()

    for(const letter of word) {
        const span = document.createElement('span')
        span.innerText = '_'
        word_tag.appendChild(span)

        letters_left.push(letter)
    }

    letters_left_count = letters_left.length
}

function try_letter(letter) {
    if(!letter.startsWith("Key") || letters_left_count == 0 || lives < 0)
        return false

    letter = letter[letter.length - 1].toLowerCase()
    if(letters_used.includes(letter))
        return false

    letters_used.push(letter)
    letters_tag.textContent = letters_used.sort().join(' ')

    if(!letters_left.includes(letter)) {
        let file_name = (10 - --lives).toString()
        if(lives > 0)
            file_name = "0" + file_name

        img_container.innerHTML = `<img src="./../img/${file_name}.png" alt="${file_name}"></img>`

        return false
    }

    for(let i=0; i<letters_left.length; i++)  {
        if(letters_left[i] != letter)
            continue

        word_tag.children[i].innerText = letter
        letters_left[i] = '.'
        letters_left_count--
    }

    return true
}

addEventListener("keydown", e => {
    try_letter(e.code)

    if ((lives >= 0 && letters_left_count != 0) || ended)
        return

    ended = true

    if (lives < 0) {
        for (let i=0; i<letters_left.length; i++) {
            if (letters_left[i] == '.')
                continue

            word_tag.children[i].classList.add('missed')
            word_tag.children[i].innerText = letters_left[i]
        }
    }

    else {
        word_tag.classList.add('found')
    }

    document.querySelector('#end').classList.remove('hidden')
    document.querySelector('#status').innerText = `You ${lives >= 0 ? 'won!' : 'lost...'}`
})