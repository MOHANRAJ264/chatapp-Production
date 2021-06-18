const socket = io()
    //elements
const $messageform = document.querySelector('#messageform') // no need for dollar sign thats user deined name
const $messageforminput = $messageform.querySelector('input')
const $messageformbutton = $messageform.querySelector('button')
const $sendlocationbutton = document.querySelector('#sendlocation')
const $messages = document.querySelector('#messages')

//templates
const messagetemplate = document.querySelector('#messagetemplate').innerHTML
const locationmessagetemplate = document.querySelector("#locationmessagetemplate").innerHTML
const sidebartemplate = document.querySelector("#sidebar-template").innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newmessage = $messages.lastElementChild

    const newmessagestyles = getComputedStyle($newmessage)
    const newmessagemargin = parseInt(newmessagestyles.marginBottom)
    const newmessageheight = $newmessage.offsetHeight + newmessagemargin

    const visibleheight = $messages.offsetHeight

    const containerheight = $messages.scrollHeight

    const scrolloffset = $messages.scrollTop + visibleheight

    if (containerheight - newmessageheight <= scrolloffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messagetemplate, {
        username: message.username,
        message: message.text,

        createdat: moment(message.createdat).format('h:mm a') //moment installed in html scripts
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('locationmessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationmessagetemplate, {
        username: message.username,
        url: message.url,
        createdat: moment(message.createdat).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

document.querySelector('#messageform').addEventListener('submit', (e) => {
    e.preventDefault()
    $messageformbutton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendmessage', message, (error) => {
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value = ''
        $messageforminput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('the message deliverd')
    })

})
socket.on('roomdata', ({ room, users }) => {
    const html = Mustache.render(sidebartemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$sendlocationbutton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation not supporetd by your browser')
    }

    $sendlocationbutton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('location shared')
            $sendlocationbutton.removeAttribute('disabled')
        })
    })
})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})