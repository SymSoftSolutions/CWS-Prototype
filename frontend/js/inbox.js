
$(document).ready(function() {
    var dataTable = $('#inbox_table').DataTable( {
        "paging":   true,
        "ordering": false,
        "pageLength": 5,
        "sDom":     'tr'
    });

    $("#inbox_searchbox").keyup(function() {
        dataTable.search(this.value).draw();
    });

    $("#inbox_prev").click(function(){
      dataTable.page( 'previous' ).draw(false);
      var info = dataTable.page.info();
      console.log('Currently showing page '+(info.page+1)+' of '+info.pages+' pages.');
    });
    $("#inbox_next").click(function(){
      dataTable.page( 'next' ).draw(false);
      var info = dataTable.page.info();
      console.log('Currently showing page '+(info.page+1)+' of '+info.pages+' pages.');
    });
});
