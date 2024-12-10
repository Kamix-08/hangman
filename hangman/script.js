const word_base_url = "https://raw.githubusercontent.com/first20hours/google-10000-english/refs/heads/master/google-10000-english-usa-no-swears-medium.txt"

const img_container = document.querySelector('#img')
const word_tag = document.querySelector('#word')
const letters_tag = document.querySelector('#letters')

let word_list

(async function fetch_word_list() {
    word_list = await fetch(word_base_url)
        .then(res => res.text())
        .then(res => res.split('\n'))
})()

const letters_left = []
const letters_used = []
let letters_left_count = 0

function clear() {
    img_container.innerHTML = ''
    word_tag.textContent = ''
    letters_tag.textContent = ''

    letters_left.length = 0
    letters_used.length = 0
    letters_left_count = 0
}

function new_game() {
    clear()

    if(!word_list) {
        alert("Failed to fetch word list...")
        return
    }

    const word = word_list[Math.floor(Math.random() * word_list.length)].trim()

    word_tag.textContent = "_ ".repeat(word.length).slice(0, -1)

    for(const letter of word) 
        letters_left.push(letter)

    letters_left_count = letters_left.length
}

function try_letter(letter) {
    if(!letter.startsWith("Key") || letters_left_count == 0)
        return false

    letter = letter[letter.length - 1].toLowerCase()
    if(letters_used.includes(letter))
        return false

    letters_used.push(letter)
    if(!letters_left.includes(letter)) {
        // draw the hangman
        return false
    }

    for(let i=0; i<letters_left.length; i++) 
        if(letters_left[i] == letter) {
            const cur_str = [...word_tag.textContent]
            cur_str[i*2] = letter

            word_tag.textContent = cur_str.join('')
            letters_left[i] = '.'
            letters_left_count--
        }
    return true
}

addEventListener("keydown", e => {
    if(try_letter(e.code))
        console.log("yay!")
    else
        console.log("womp")
})