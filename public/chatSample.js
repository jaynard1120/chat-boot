$(function () {
  var socket = io();
  var name = $('#name').val() || "Someone";
  function updateScroll() {
    var element = document.getElementById("msg");
    element.scrollTop = element.scrollHeight;
  }
  
  var date = new Date();
  var weekday = date.toLocaleString("default", { weekday: "long" })

  $('#out').click(() => {
    Swal.fire({
      title: 'Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/'
      }
    })
  })

  appendMessage("<center><div>You joined the group chat</div></center>  ")
  socket.emit('new-user', name);
  socket.emit('onlines');
  $('#user').html(`| ${name}`);
  $('form').submit(function (e) {

    updateScroll();
    e.preventDefault();
    if ($('#m').val() != "") {
      // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('.message-container')
        .append(
          ` <div class="d-flex justify-content-end mb-4">
          <div class="msg_cotainer_send">
          &nbsp; ${$('#m').val()}
          </div>
          <div class="img_cont_msg">
          <img src="./public/pro.png" class="rounded-circle user_img_msg">
          </div>
          <span class="msg_time_send">${checkDate(date.getHours(),date.getMinutes())}  ${weekday}</span>
          </div>`);
  
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
    $('#type').append(`<p style="color: white">${name} is typing ...`)
  })


  socket.on('chat message', function (data) {
          appendMessage(`
          <br>
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="../public/prof.png"
                            class="rounded-circle user_img_msg">
                    </div>
                    <span class="name">${data.name}</span>&nbsp;
                    <div class="msg_cotainer">
                        ${data.message}
                        </div>
                        <span class="msg_time">${checkDate(date.getHours(),date.getMinutes())}: ${weekday}</span>
                </div>
          `);
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
          $('#online').append(`<div" style="float:left" id="pm"> <img src="../public/online.png" style="width: 40px;float: left;"><p style="float: left;padding: 10px;font-weight: bold">${userOn}</p></div><br>`)
        })
  })
  socket.on('onlines',users=>{
          $('#online').empty()
    users.nicknames.filter(element=>{
      return element != name;
    }).map(userOn=>{
          $('#online').append(`<div style="float:left" id="pm"> <img src="../public/online.png" style="width: 40px;float: left;"><p style="float: left;padding: 10px;font-weight: bold">${userOn}</p></div><br>`)
        })
  })

  socket.on('user-disconnected', user => {
          appendMessage(`<center><div>${user.user} left the chat group!</div><center>`)
    $('#online').empty()
    user.online.filter(element=>{
      return element != name;
    }).map(userOn=>{
          $('#online').append(`<div style="float:left" id="pm"> <img src="../public/online.png" style="width: 40px;float: left;"><p style="float: left;padding: 10px;font-weight: bold">${userOn}</p></div><br>`)
        })
  })

  $('#menuBtn').click(function () {
    // alert("Clicked!")
    $('#sidebar-wrapper').css('left', '230px')
    $('#overlay').css('display', 'block')
});

$('#overlay').click(function () {
    checkWidth()
    // $('#sidebar-wrapper').css('left', '0px')
    // $('#overlay').css('display', 'none')
});
if ($(window).width() < 954) {
    checkWidth()
}
$(window).resize(checkWidth);

function checkWidth() {
    if ($(window).width() > 954) {
        $('#out').html('<i class="fa fa-power-off">&nbsp;Leave</i>')
        $('#sidebar-wrapper').css('left', '300px')
        $('#overlay').css('margin-top', '-1%')
        $('.title').css('font-size', '40px;')
        $('#overlay').css('display', 'block')

    } else {
        $('#out').html('<i class="fa fa-power-off"></i>')
        $('.title').css('font-size', '30px')
        $('#overlay').css('margin-top', '-1%')
        $('#sidebar-wrapper').css('left', '0')
    }
}

function checkDate(hour, minutes){
  
  if(hour>12){
    return hour-12+":"+minutes+", PM"
  }else{
    return hour+":"+minutes+", AM"
  }
}

});



let appendMessage = (tags) => {
          $('.message-container').append(tags)
        }

function onlineUsers(user) {
  return `<h6 class='text-center'>${user}</h6>`
}

