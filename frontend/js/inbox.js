
function setInboxRowHandler() {
  // Setup message when row is selected
  $("#inbox_table tr td:not(:first-child)").off('click').click(function(){
      //$("#response_msg_body").css("width", $("#response_msg_div").width() - 85);
      $("#inbox_table").hide();
      var parent = $(this).parent();
      $("#inbox_message .curr-msg-from").text(parent.find(".msg-from").text());
      $("#inbox_message .curr-msg-date").text(parent.find(".msg-date").text());
      $("#inbox_message .curr-msg-subject").text(parent.find(".msg-subject").text());
      $("#inbox_message .curr-msg-body").html(parent.find(".msg-body").text() + "<br/><br/>" + parent.find(".msg-body").text());
      $("#inbox_message").show();
  });
}

$(window).resize(function(){
    var windowWidth = $(window).width();

    if(windowWidth < 768) {
        $("#inbox_container").removeClass("container-fluid");
        $("#response_msg_body").css("width", "100%");
    } else {
        $("#inbox_container").addClass("container-fluid");
        if(windowWidth > 1500) {
          $("#response_msg_body").css("width", "104%");
        } else {
          $("#response_msg_body").css("width", "101%");
        }
    }
});

$(document).ready(function() {
    var dataTable = $('#inbox_table').DataTable( {
        "paging":   true,
        "ordering": false,
        "pageLength": 5,
        "sDom":     'tr',
        "ajax": {
            "url": '/getMessages',
            "type": "POST"
        },
        "deferRender": true
    });

    /*
    jQuery.post('/getMessages',{}, function(response, statusString) {
        
    });
    */

    $("#inbox_searchbox").keyup(function() {
        dataTable.search(this.value).draw();
    });

    // Pagination setup
    var info = dataTable.page.info();
    if(info) {
      $(".total-records").text(info.recordsTotal);
      $(".page-start").text(info.start+1);
      $(".page-end").text(info.end);
      if(info.start == 0) {
          $("#inbox_prev").addClass("not-active");
      }
      if(info.end == info.recordsTotal) {
          $("#inbox_next").addClass("not-active");
      }
    }

    $("#inbox_prev").click(function(){
      dataTable.page( 'previous' ).draw(false);
      var info = dataTable.page.info();
      // Disable btn when we're on the 1st page
      if(info.start == 0) {
          $(this).addClass("not-active");
      } else {
          $(this).removeClass("not-active");
      }
      $("#inbox_next").removeClass("not-active");
      $(".page-start").text(info.start+1);
      $(".page-end").text(info.end);
      setInboxRowHandler();
    });
    $("#inbox_next").click(function(){
      dataTable.page( 'next' ).draw(false);
      var info = dataTable.page.info();
      // Disable btn when we're on the last page
      if(info.end == info.recordsTotal) {
          $(this).addClass("not-active");
      } else {
          $(this).removeClass("not-active");
      }
      $("#inbox_prev").removeClass("not-active");
      $(".page-start").text(info.start+1);
      $(".page-end").text(info.end);
      setInboxRowHandler();
    });

    setInboxRowHandler();

    // Current message back btn function
    $("#inbox_message .curr-msg-back").click(function(){
        $("#inbox_message").hide();
        $("#inbox_table").show();
    });

    $(window).trigger('resize');
});
