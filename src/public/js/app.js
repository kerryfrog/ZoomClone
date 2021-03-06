//front end에 socket 설치 
const socket = io();

const welcome = document.getElementById("welcome")
const roomform = welcome.querySelector("#enter");
const nameform = welcome.querySelector("#name")
const room = document.getElementById("room");

room.hidden = true;
let roomName;
let nickname;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function backendDone(msg){
    console.log(`The backend says:`,msg);
}

function handleMessageSubmit(event){
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message",input.value, roomName,() => {
      addMessage(`You: ${value}`);
  }); 
  input.value =""; 
}


function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3"); 
    h3.innerText =`Room: ${roomName}`;
    const msgform = room.querySelector("#msg");
    msgform.addEventListener("submit", handleMessageSubmit);
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = welcome.querySelector("#name input");
    const h3 = welcome.querySelector("h3"); 
    h3.innerText =`Nickname: ${input.value}`;
    socket.emit("nickname",input.value);
    input.value = "";
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = roomform.querySelector("#enter input");
    socket.emit("enter_room", input.value, showRoom); // end socket.emit
    roomName = input.value;
    input.value ="" 
}

roomform.addEventListener("submit", handleRoomSubmit);
nameform.addEventListener("submit", handleNicknameSubmit)

socket.on("welcome", (user, newCount) =>{
    const h3 = room.querySelector("h3"); 
    h3.innerText =`Room: ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});

socket.on("bye",(left, newCount)=> {
    const h3 = room.querySelector("h3"); 
    h3.innerText =`Room: ${roomName} (${newCount})`;
    addMessage(`${left} left`);
})

socket.on("new_message", addMessage);

//socket.on("room_change", console.log);
// 아래와 동일 
socket.on("room_change", (rooms) =>{
    const roomList = welcome.querySelector("ul");
    if(rooms.length ===0){
        roomList.innerHTML ="";
        return;
    }
    
    rooms.forEach(room=>{
        const li =document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});