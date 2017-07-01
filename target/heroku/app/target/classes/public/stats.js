
$(document).ready(function () {

    fillTable("sea");
    fillTable("dino");

});

function fillTable(edition) {
    var template = "<tr><td><img class='character-img' src='{character-img}'></td><td>{win}</td><td>{loose}</td><td>{tie}</td></tr>"
    $.get("/tictactoe/"+edition+"/stats", "jsonp").done(function (json) {
        json = JSON.parse(json);

        json.sort(compare);
        function compare(a, b) {
          if (a.win > b.win) {
            return -1;
          }
          if (a.win < b.win) {
            return 1;
          }

          return 0;
        }

        json.forEach(function(data) {
                var result = template.replace("{character-img}", data.playerImg);
                    result = result.replace("{win}", data.win);
                    result = result.replace("{loose}", data.loose);
                    result = result.replace("{tie}", data.tie);
                    $("#"+edition+"-stats").append(result);


        });

    }, "json");
}

