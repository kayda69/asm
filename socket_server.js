const io = require( "socket.io" )();
const socketapi = {
io: io
};

// Code tuong tac gi do se viet vao day
io.on("connection", (client) =>{
    console.log("Client connected : " + client.id);
    // định nghĩa 1 sự kiện
    client.on('cmt', (data)=>{
    // nhận dữ liệu từ client gửi lên
    console.log("cmt: " + data );
    // gửi phản hồi
    //client.emit("cmt", "Server da nhan roi nhe: " + data );
    });

    client.on('register', (data)=>{
        // nhận dữ liệu từ client gửi lên
        console.log("register: " + data );
        // gửi phản hồi
       client.emit("register", "Đăng ký tài khoản thành công!");
        });
    
    // sự kiện ngắt kết nối
    
    
    client.on('disconnect', ()=>{
    console.log("Client disconected!");
    })
    
    
    });
module.exports = socketapi;

