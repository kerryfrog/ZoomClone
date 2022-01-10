//Front end File 
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

//back 과의 연결을 해줌요 
const socket = new WebSocket(`ws://${window.location.host}`);

//object into string 
function makeMessage(type , payload){
    const msg ={type, payload};
    return JSON.stringify(msg);
}


//브라우저의 action을 감지 
socket.addEventListener("open",()=>{
    console.log("connected to Server O");
});

socket.addEventListener("message",(message)=>{
    const li = document.createElement("li");
    li.innerText = message.data.toString("utf8");
    messageList.append(li);
})

socket.addEventListener("close", ()=>{
    console.log("DisConnected from Server X")
});


function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    // backend 에게 보냄 
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`
    messageList.append(li);
    input.value="";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value="";
}

messageForm.addEventListener("submit", handleSubmit);

nickForm.addEventListener("submit",handleNickSubmit);