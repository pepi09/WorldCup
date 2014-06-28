var get_today_matches = function( cb ){

  var today_matches = [],
    code = "",
    home_team_info = "",
    away_team_info = "";

  var team_info_generator = function(info){
    return info.country+" is in "+info.group_letter+" group. With "+info.wins+" wins, "+info.losses+" losses and "+info.games_played+" games played.";
  }

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
}
});
cb(today_matches);
});
}


get_today_matches(function(matches){

console.log(matches);


matches.forEach(function(match){
    if (match["status"] === "future"){


    var start_time = "Match starts at: 13:00h"

    var source   = $("#entry-template").html();
  var template = Handlebars.compile(source);
  var context = {
        home_team: match["home_team"],
        away_team: match["away_team"],
        home_goals: match["home_goals"],
        away_goals: match["away_goals"],
        home_flag: match["home_flag"],
        away_flag: match["away_flag"],
        home_team_info: match["home_team_info"],
        away_team_info: match["away_team_info"],
        start_time : start_time,
    }
  var html    = template(context);
  $("#body").append(html);
}
else {
    today = new Date();
    today = today.toJSON();
    var now = Date.parse(today);

    var match_time = Date.parse(match["datetime"]);
    // console.log(match_time);
    var end_time = (match_time + 5400000) - now;
    // console.log(end_time);


    var homeTeam = match["home_team"];
    var awayTeam = match["away_team"];

    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var context = {
        home_team: homeTeam["country"],
        away_team: awayTeam["country"],
        home_goals: homeTeam["goals"],
        away_goals: awayTeam["goals"],
        home_flag: homeTeam["code"],
        away_flag: awayTeam["code"],
        match_progress : end_time,

    }
    var html    = template(context);
    $("#body").append(html);
}
  $('.flag_image').popover();

});
});
