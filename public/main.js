'use strict';

$(init);

function init() {

    $(".submit-button").click(submitHandler);
    $("#todo-list-table").on("click",".delete-button",deleteHandler);
    $("#todo-list-table").on("click",".completed-check",completeHandler);
    queryDatabase("GET","gettodos");
}

function submitHandler(e) {
    e.stopPropagation;
    if($(".desc-input").val() && $(".due-date-input").val()){
          queryDatabase("POST", "newtodo");
    }
    else{
      alert("Looks like you didn't fill in all the boxes");
    }
    console.log("submit");

}

function deleteHandler(e) {
    e.stopPropagation;
    console.log($("span.glyphicon.glyphicon-remove.delete-button").index($(this))-1);
    queryDatabase("DELETE","deletetodo/"+parseInt(parseFloat($("span.glyphicon.glyphicon-remove.delete-button").index($(this)))-1));
}

function completeHandler(e) {
    e.stopPropagation;
    console.log($(this));
    console.log(parseInt(parseInt($("input.completed-check").index($(this)))-1));
    queryDatabase("POST","updatetodo/"+parseInt(parseInt($("input.completed-check").index($(this)))-1));
}

function queryDatabase(requestType, requestString) {
    $.ajax({
        method: requestType,
        url: "//localhost:8000/" + requestString,
        data: {
            "desc": $(".desc-input").val(),
            "duedate": $(".due-date-input").val(),
            "completed": false
        },
        success: function(data) {
            console.log(data);
            if(requestType==="GET"){
              updateTable(JSON.parse(data));
            }
            else{
              updateTable(data);
            }
            
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function updateTable(data) {
  console.log("updateTable: ",data);
  console.log("data length: ",data.length);
  $(".newToDo").remove();
    var $table = $("#todo-list-table");
    var $toDoArr = [];
    for (var i = 0; i < data.length; i++) {
        var $toDo = $("#todo-list-template").clone();
        $toDo.removeAttr("id");
        $toDo.addClass("newToDo");
        $toDo.find(".description").text(data[i].desc);
        $toDo.find(".due-date").text(data[i].duedate);
        console.log(data[i].completed);
        $toDo.find(".completed-check").prop("checked",data[i].completed);
        $toDo.show();
        $toDoArr.push($toDo);
    }
    $table.append($toDoArr);
}