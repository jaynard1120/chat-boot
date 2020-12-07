$(function () {
  var socket = io();
  var name = $('#name').val() || "Someone";

  function updateScroll(){
    var element = document.getElementById("msg");
    element.scrollTop = element.scrollHeight;
}
  appendMessage("<center><div>You joined the group chat</div></center>  ")
  socket.emit('new-user', name);
  socket.emit('onlines');

  $('form').submit(function (e) {

    updateScroll();
    e.preventDefault();
if($('#m').val()!=""){
    // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('.message-container').append(`<div class='d-flex justify-content-end mb-4'><div class='msg_cotainer_send border border-success msg-current'>${$('#m').val()}</div><img src="../public/profile.png" style="width: 50px;"></div>`);
    $('#m').val('');
    return false;
  }
  });
  $('#m').on("input", () => {
    socket.emit("user-typing", name);
  })
  $("body").on("click", () => {
    socket.emit("untyping");
  })
  socket.on('user-typing', (name) => {
    $('#type').empty()
    $('#type').append(`<p>${name} is typing ...`)
  })
  socket.on('chat message', function (data) {
    appendMessage(`<div class='d-flex justify-content-start mb-4 msg-div'><img src="../public/yourProf.png" style="width: 50px;"><div class='msg_cotainer border border-primary msg-current'>${data.name}: ${data.message}</div></div>`);
    updateScroll();
  });

  socket.on("untyping", () => {
    $('#type').empty()
  })
  socket.on('user-connected', (user) => {
    appendMessage(`<center><div>${user.name} is connected!</div></center>`)
    $('#online').empty()
    user.online.filter(element=>{
      return element != name;
    }).map(userOn=>{
      $('#online').append(`<div style="float: left;"> <img src="../public/online.png" style="width: 40px;float: left;"><p style="float: left;padding: 10px;font-weight: bold">${userOn}</p></div>`)
    })
  })
  socket.on('onlines',users=>{
    $('#online').empty()
    users.nicknames.filter(element=>{
      return element != name;
    }).map(userOn=>{
      $('#online').append(`<div style="float: left;"> <img src="../public/online.png" style="width: 40px;float: left;"><p style="float: left;padding: 10px;font-weight: bold">${userOn}</p></div>`)
    })
  })

  socket.on('user-disconnected', user => {
    appendMessage(`<center><div>${user.user} left the chat group!</div><center>`)
    $('#online').empty()
    user.online.filter(element=>{
      return element != name;
    }).map(userOn=>{
      $('#online').append(`<div style="float: left;"> <img src="../public/online.png" style="width: 40px;float: left;"><p style="float: left;padding: 10px;font-weight: bold">${userOn}</p></div>`)
    })
    
  })

  $('#out').click(()=>{
    Swal.fire({
      title: 'Do you want to disconnect?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("yes")
        $('#form').submit(function (e) { 
         
        });
      }
    })
  })


});

let appendMessage = (tags) => {
  $('.message-container').append(tags)
}

function onlineUsers(user) {
  return `<h6 class='text-center'>${user}</h6>`
}

