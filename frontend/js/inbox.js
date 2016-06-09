
var dataTable, selectedMsgIds = [];
var viewUtils = require('../../lib/viewUtils.js');

function setInboxRowHandler() {
  // Setup message when row is selected
  $("#inbox_table tr td:not(:first-child)").off('click').click(function(){
      //$("#response_msg_body").css("width", $("#response_msg_div").width() - 85);
      $("#inbox_table").hide();
      var parent = $(this).parent();
      var avatar = parent.find(".msg-avatar").text();
      if(avatar != null && avatar != "null") {
          $("#inbox_message .curr-msg-img").attr("src",viewUtils.getAvatarPath(avatar));
      } else {
          $("#inbox_message .curr-msg-img").attr("src",'');
      }
      $("#inbox_message .curr-msg-from").text(parent.find(".msg-from").text());
      $("#inbox_message .curr-msg-date").html(parent.find(".msg-long-date").html());
      $("#inbox_message .curr-msg-subject").text(parent.find(".msg-subject").text());
      $("#inbox_message .curr-msg-body").html(parent.find(".msg-body").html());
      var fromID = parent.find(".msg-from-id").text();
      var toID = parent.find(".msg-to-id").text();

      //The function "to" when replying ought be the fromID, except of course, when replying to sent mail
      if($("#sent_msg_list").hasClass('active')) {
          $("#inbox_message .curr-msg-to-id").html(toID);
      } else {
          $("#inbox_message .curr-msg-to-id").html(fromID);
      }

      // Check if sender and receiver are the same
      if(toID == fromID) {
          $("#inbox_message .curr-msg-to").html("me");
      } else {
          $.ajax({
              method: "POST",
              async: false,
              url: "/getUserDetails",
              data: { "userID": toID }
          }).done(function( msg ) {
              $("#inbox_message .curr-msg-to").html(msg.name);
          });
      }

      $("#inbox_message").show();
  });
  setInboxCheckboxHandlers();
}

// Init handler for checkboxes
function setInboxCheckboxHandlers() {
    $("#inbox_table .msg-checkbox").off('click').click(function () {
       $(this).prop('checked');

       var selectedMsgs = 0;
       selectedMsgIds = [];
       $("#inbox_table .msg-checkbox").each(function(idx) {
          if($(this).prop('checked')) {
              selectedMsgIds.push(parseInt($(this).val()));
              selectedMsgs++;
          }
       });
       if(selectedMsgs > 0) {
          $(".inbox_delete_btn").css("display","inline-block");
          if($(window).width() < 768) {
              $(".inbox_delete_btn_mobile").css("display","inline-block");
          }
       } else {
          $(".inbox_delete_btn").hide();
          if($(window).width() < 768) {
              $(".inbox_delete_btn_mobile").hide();
          }
       }
    });
}

// Set all checkboxes to false
function resetInboxCheckboxes() {
     $("#inbox_table .msg-checkbox").each(function(idx) {
        $(this).prop('checked',false);
     });
     $(".inbox_delete_btn").css("display","none");
     $(".inbox_delete_btn_mobile").css("display","none");
}

function getInboxMessages(url) {
    if (typeof (url) === 'undefined') url = "/getMessages";
    dataTable.clear().draw();
    $.ajax({
      url: url,
      type: "POST",
      success: function (response) {
          var msgsArr = response.data;
          $("#inbox_message").hide();
          $("#inbox_table").show();
          if(msgsArr && msgsArr.length > 0) {
              msgsArr.reverse();
              dataTable.clear().draw();
              for (var i = 0; i < msgsArr.length; i++) {
                  var newRow = [], msgEntry = "", a_p = "";
                  var userID = msgsArr[i][0], subject = msgsArr[i][1], body = msgsArr[i][2], date = msgsArr[i][3], msgJSON = msgsArr[i][4], msgId = msgsArr[i][5];
                  var recipientID = msgJSON.recipientID;
                  var trimBody = body.split('\n')[0];
                  trimBody = (trimBody.length > 150 ? trimBody.substring(0,140) + "..." : trimBody);
                  body = body.replace(/\n/g, "<br />");
                  date = new Date((( date || "").replace(/-/g,"/").replace(/[TZ]/g," ")).split('.')[0]);
                  // Format date
                  var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                  var curr_date = date.getDate();
                  var curr_month = date.getMonth();
                  var curr_year = date.getFullYear();
                  var curr_hour = date.getHours();
                  var curr_min = date.getMinutes();
                  if (curr_hour < 12) a_p = "AM";
                  else a_p = "PM";
                  if (curr_hour == 0) curr_hour = 12;
                  if (curr_hour > 12) curr_hour = curr_hour - 12;

                  var d = new Date();
                  if (d.toDateString() === date.toDateString()) { // Check if msg date is today, if so only display the hour
                      date = curr_hour + ":" + (curr_min < 10 ? "0" + curr_min : curr_min) + " " + a_p;
                  } else {
                      date = m_names[curr_month] + " " + curr_date;
                  }
                  var fullDate;
                  if($(window).width() < 768) {
                      fullDate = m_names[curr_month] + " " + curr_date + "<br/>" + curr_hour + ":" + (curr_min < 10 ? "0" + curr_min : curr_min) + " " + a_p;
                  } else {
                      fullDate = curr_hour + ":" + (curr_min < 10 ? "0" + curr_min : curr_min) + " " + a_p + " " + m_names[curr_month] + " " + curr_date;
                  }
                  $.ajax({
                    method: "POST",
                    async: false,
                    url: "/getUserDetails",
                    data: { "userID": userID }
                  }).done(function( msg ) {
                    newRow.push('<input type="checkbox" class="msg-checkbox" value="' + msgId + '">');
                    msgEntry += '<span class="msg-from">' + msg.name + '</span><br/>' +
                                '<span class="msg-subject">' + subject + '</span><br/>' +
                                '<span class="msg-trim-body hidden-xs">' + trimBody + '</span>' +
                                '<span class="msg-body hidden">' + body + '</span>' +
                                '<span class="msg-long-date hidden">' + fullDate + '</span>' +
                                '<span class="msg-to-id hidden">' + recipientID + '</span>' +
                                '<span class="msg-from-id hidden">' + userID + '</span>' +
                                '<span class="msg-avatar hidden">' + msg.avatar + '</span>';
                    newRow.push(msgEntry);
                    newRow.push('<span class="msg-date">' + date + '</span>');
                    dataTable.row.add(newRow).draw(false);
                    paginationSetup();
                  });
              }
          }
      },
      error: function (xhr, status, errorThrown) { console.log("Error"); }
    });
}

$(window).resize(function(){
    var windowWidth = $(window).width();

    if(windowWidth < 768) {
        $("#inbox_container").removeClass("container-fluid");
        $(".profile-container").removeClass("container-fluid");
        $("#response_msg_body").css("width", "100%");
        $("#new_msg_div").addClass("new-msg-mobile");
        $("#new_msg_subject").css("padding-left","15px");
        $(".selectize-input").css("padding-left","15px");
        $("#new_msg_div #new_msg_content").css("height","100px");
    } else {
        $("#inbox_container").addClass("container-fluid");
        $(".profile-container").addClass("container-fluid");
        $("#new_msg_div").removeClass("new-msg-mobile");
        $("#new_msg_subject").css("padding-left","0px");
        $(".selectize-input").css("padding-left","0px");
        $("#new_msg_div #new_msg_content").css("height","auto");
        $(".inbox_delete_btn_mobile").hide();
    }
});

function deleteMessages() {
    for(var i = 0; i < selectedMsgIds.length; i++) {
      $.ajax({
          method: "POST",
          url: "/deleteMessage",
          data: { "messageID": selectedMsgIds[i] }
      }).done(function( msg ) {
          $(".inbox_delete_btn").hide();
          $(".inbox_delete_btn_mobile").hide();
          if($("#sent_msg_list").hasClass('active')) {
              getInboxMessages("/sendMessages");
          } else {
              getInboxMessages();
          }
      });
    }
}

function paginationSetup() {
  // Pagination setup
  var info = dataTable.page.info();
  if(info) {
    $(".total-records").text(info.recordsTotal);
    $(".page-start").text((info.recordsTotal == 0 ? info.start : info.start+1));
    $(".page-end").text(info.end);
    if(info.start == 0) {
        $("#inbox_prev").addClass("not-active");
    }
    if(info.end == info.recordsTotal) {
        $("#inbox_next").addClass("not-active");
    } else {
        $("#inbox_next").removeClass("not-active");
    }
  }
  setInboxRowHandler();
}

$(document).ready(function() {

    dataTable = $('#inbox_table').DataTable( {
        "paging":   true,
        "ordering": false,
        "pageLength": 10,
        "sDom":     'tr',
        "language": {
            "emptyTable": "You have no messages in your inbox",
            "zeroRecords":    "No matching messages found",
            "loadingRecords": "Loading..."
        }
    });

    getInboxMessages();

    // Enable/Disable reply btn if reply body is empty or not
    $("#response_msg_body").bind('input propertychange', function() {
        if($(this).val().length) {
            $("#response_msg_btn").removeClass("not-active");
        } else {
            $("#response_msg_btn").addClass("not-active");
        }
    });
    $("#new_msg_content").bind('input propertychange', function() {
        if($(this).val().length) {
            $("#send_new_msg_btn").removeClass("not-active");
        } else {
            $("#send_new_msg_btn").addClass("not-active");
        }
    });

    // Delete Message handler
    $(".inbox_delete_btn").click(function() {
        deleteMessages();
    });

    $(".inbox_delete_btn_mobile").click(function() {
        deleteMessages();
    });

    $("#inbox_body #new_msg_btn").off('click').on('click', function() {
        $("#new_msg_div").fadeIn();
    });
    $("#new_msg_btn_mobile").click(function() {
        $("#new_msg_div").fadeIn();
    });
    $("#close_new_msg").click(function() {
        $("#new_msg_div").fadeOut();
    });
    $("#cancel_new_msg").click(function() {
        $("#new_msg_div").fadeOut();
    });

    // Creation of a new message
    $("#send_new_msg_btn").click(function() {
        $("#send_new_msg_btn").addClass("not-active");
        $.ajax({
            method: "POST",
            url: "/message",
            data: {
                "subject": $("#new_msg_subject").val(),
                "recipientID": $("#new_msg_to").val(),
                "text": $("#new_msg_content").val()
        }}).done(function( msg ) {
            $("#new_msg_alert").removeClass("hidden");
            setTimeout(function(){
              $("#new_msg_div").fadeOut();
              $("#new_msg_alert").addClass("hidden");
              $("#new_msg_subject").val('');
              $("#new_msg_to").val('');
              $("#new_msg_content").val('');
              // Clear To field
              var $select = $('#new_msg_to').selectize();
              var control = $select[0].selectize;
              control.clear();
            }, 1200);
            if($("#sent_msg_list").hasClass('active')) {
                getInboxMessages("/sendMessages");
            } else {
                getInboxMessages();
            }
        });
    });

    // Reply to existing message
    $("#response_msg_btn").click(function() {
        $("#response_msg_btn").addClass("not-active");
        $.ajax({
            method: "POST",
            url: "/message",
            data: {
                "subject": "Re: "+$(".curr-msg-subject").text(),
                "recipientID": $(".curr-msg-to-id").text(),
                "text": $("#response_msg_body").val()
        }}).done(function( msg ) {
            $("#response_msg_alert").removeClass("hidden");
            setTimeout(function(){
              $("#new_msg_div").fadeOut();
              $("#response_msg_body").val('');
              $("#response_msg_alert").addClass("hidden");
              $("#inbox_message .curr-msg-back").trigger('click');
            }, 2000);
            if($("#sent_msg_list").hasClass('active')) {
                getInboxMessages("/sendMessages");
            } else {
                getInboxMessages();
            }
        });
    });

    $("#inbox_searchbox").keyup(function() {
        dataTable.search(this.value).draw();
    });

    paginationSetup();

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
        setInboxCheckboxHandlers();
    });

    $("#inbox_msg_list").click(function(){
        getInboxMessages();
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });
    $("#sent_msg_list").click(function(){
        getInboxMessages("/sendMessages");
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });

    $(window).trigger('resize');
});
