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
      html;


  if (match["status"] === "future"){

  $(".progress progress-striped").remove();

  context = {
        home_team: match["home_team"],
        away_team: match["away_team"],
        home_goals: match["home_goals"],
        away_goals: match["away_goals"],
        home_flag: match["home_flag"],
        away_flag: match["away_flag"],
        home_team_info: match["home_team_info"],
        away_team_info: match["away_team_info"],
        start_time : "Match starts at: " + timing(match["time"], match["status"]) + "h",
    };
    html    = template(context);
  $("#body").append(html);
}
else {
    context = {
        home_team: match["home_team"],
        away_team: match["away_team"],
        home_goals: match["home_goals"],
        away_goals: match["away_goals"],
        home_flag: match["home_flag"],
        away_flag: match["away_flag"],
        home_team_info: match["home_team_info"],
        away_team_info: match["away_team_info"],
        start_time : start_time,
      };
    html = template(context);
    $("#body").append(html);
}
  $('.flag_image').popover();

});
});

var timing = function(time, status) {
    var start_time = moment(time).format("H:mm"),
        now = moment().format("H:mm"),
        time_left;
        console.log(start_time);
    if ( status === "future"){
        return start_time;
    }
    else{
        time_left = parseInt(start_time.add('m', 90).toArray().join(),10);
        console.log(time_left);
        return time_left;
    }

};
