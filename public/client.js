const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
    else{
        console.log("clicked")
        socket.emit('typehere',{user:name})
    }
})



socket.on("typehere",(msg)=>{
    console.log(msg.user)
    if(msg.user==""){
        let dataadd=document.querySelector(".addtypingmsg")
        dataadd.innerText="NO ONE ARE FREE RIGHT NOW"
    }else{
        let dataadd=document.querySelector(".addtypingmsg")
    dataadd.innerText=`${msg.user} is typing.....`
    }
    
})



function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim(),
        date:Date()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)
    socket.emit('typehere',{user:""})
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    if(type == "outgoing")
    {
        let markup = `<b>
        <p>${msg.message}</p></b><br>
        <h6>${msg.date.split('GMT')[0]}</h6>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    }
    else{
        let markup = `<b>
        <p>${msg.message}</p></b><br>
        <h6>${msg.date.split('GMT')[0]}</h6>
        <h6>Sent By&nbsp&nbsp:&nbsp&nbsp<span class="user">${msg.user}</span></h6>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    }

    
}

// Recieve messages 
socket.on('message', (msg) => {
    // console.log(msg)
    appendMessage(msg, 'incoming')
    scrollToBottom()
})





function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}


