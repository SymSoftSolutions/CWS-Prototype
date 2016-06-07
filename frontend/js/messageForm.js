$(document).ready(function() {
    $.ajax({
          method: "POST",
      url: "/getUserDetails",
      data: { "userID":1 }
    })
      .done(function( msg ) {
            console.log(msg);
      });
    });
