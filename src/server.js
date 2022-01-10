//npm run dev
import http from "http";
import express from "express";
import SocketIO from "socket.io";

//  __dirname : 현재 실행중인 폴더 경로 
const app =express();

//views폴더의 엔진으로 pug를 사용하겠다.
app.set('view engine', "pug");
app.set("views",__dirname+ "/views");

//express.static : express의 정적 파일 제공 
// user에게 public folder를 사용가능하게 제공 /public 이동시 public폴더를 볼 수있음 
app.use("/public",express.static(__dirname +"/public"));

app.get ("/", (req, res) => res.render("home"));
// 어떤 주소를 받아도 /로  redirect  시킴 
// render : 값을 보냄 response :특정 주소로 보내버림 요 
app.get ("/*", (req, res) => res.redirect("/"));
const handleListen =() => console.log(`Listenning on http://localhost:3000`);

///http server , web socket server 둘다 사용가능 
//http server
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    //socket 에서 일어나는 일을 log 찍을 수 있음 일종의 미들웨어 
    socket.onAny((event) => {
        console.log(`socket Event:${event}`)
    })
    socket.on("enter_room", (roomName, done) =>{            
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
}); //end wsServer.on

httpServer.listen(3000, handleListen);
/*
//wev socket server 생성 http server 위에 생성 
const wss = new WebSocket.Server({server});


const sockets =[];

//connection이 발생할 때 까지 기다림 
wss.on("connection", (socket)=>{
    //서버에 연결된 브라우저들의 정보 저장 
    sockets.push(socket);
    //socket 안에 데이터 저장 가능 
    socket["nickname"] = "Anon"
    // soket 이 가진 method를 이용
    console.log("connected to Brower ✅");
    socket.on("close", ()=> {console.log("Disconnected from the Broser ")});
    //연결된 모든 브라우저에게 받은 메시지를 보냄 
    socket.on("message", msg => {
        //string into javascrpit object
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
               sockets.forEach((aSocket) => 
                aSocket.send(`${socket.nickname}: ${message.payload}`));
                break; 
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});

*/
