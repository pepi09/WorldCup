var get_today_matches = function( cb ){

  var today_matches = [],
    code = "",
    home_team_info = "",
    away_team_info = "";

  var team_info_generator = function(info){
    return info.country+" is in "+info.group_letter+" group. With "+info.wins+" wins, "+info.losses+" losses and "+info.games_played+" games played.";
  };

$.when( $.getJSON("http://worldcup.sfg.io/matches/today"), $.getJSON("http://worldcup.sfg.io/teams/results") )
  .done(function(matches, results) {

matches[0].forEach(function(element, index){
  results[0].forEach(function(element1){

    if(element1.fifa_code === element.home_team.code){
      home_team_info = team_info_generator(element1);
    }
    if(element1.fifa_code === element.away_team.code){
      away_team_info = team_info_generator(element1);
    }
  });


today_matches[index] = {
  home_team: element.home_team.country,
  away_team: element.away_team.country,
  home_goals: element.home_team.goals,
  away_goals: element.away_team.goals,
  home_flag: element.home_team.code,
  away_flag: element.away_team.code,
  time: element.datetime,
  status: element.status,
  home_team_info: home_team_info,
  away_team_info: away_team_info
};
});
cb(today_matches);
});
};


get_today_matches(function(matches){

matches.forEach(function(match){
  var source   = $("#entry-template").html(),
      template = Handlebars.compile(source),
      context = {},
      homeTeam = match["home_team"],
      awayTeam = match["away_team"],
      html,
      match_has_started = match["status"] != "future",
      home_result = match_has_started ? match["home_goals"] : "",
      away_result = match_has_started ? match["away_goals"] : "";


context = {
        home_team: match["home_team"],
        away_team: match["away_team"],
        home_goals: home_result,
        away_goals: away_result,
        home_flag: match["home_flag"],
        away_flag: match["away_flag"],
        home_team_info: match["home_team_info"],
        away_team_info: match["away_team_info"],
        start_time : timing(match["time"], match["status"]),
        per : timing(match["time"], match["status"]),
    };
    html  = template(context);
  $("#body").append(html);
});
  $('.flag_image').popover();
});

var timing = function(time, status) {
    var start_time = new Date(time),
        now = new Date();
    $(".progress").toggle();
    if ( status === "future"){
        $(".progress").toggle();
        return "Match starts at: " + moment(time).format("H:mm") + "h";
    }
    else{
      $(".progress").toggle();
        start = start_time.getTime();
        var current = now.getTime(),
        current_time = (current - start)/ 60000;
        if (current_time <= 45){
          return  current_time.toFixed();
        }
        else if(current_time > 45 && current_time <= 60) {
          return (current_time - (current_time - 45)).toFixed();
        }
        else {
          return (current_time - 15).toFixed();
        }
    }

};
