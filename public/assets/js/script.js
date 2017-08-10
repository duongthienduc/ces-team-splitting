$(function() {

  const START_RUNNING_INTERVAL = 500;
  const STOP_RUNNING_INTERVAL = 50;

  var groups = [];
  var teams = [];

  $('#btnRefresh').click(function() {
    var numGroups = window.parseInt($('#inpNumGroups').val());

    if (numGroups <= 0) {
      return;
    }

    groups = [];

    for (var i = 1; i <= numGroups; i++) {
      groups.push({
        id: i,
        name: 'Group ' + i,
        members: [
          '',
          '',
          '',
          ''
        ]
      });
    }

    $('.groups-list > li').remove();

    generateAllGroups(groups);
  });

  $('#btnProcess').click(function() {
    doSplitting(START_RUNNING_INTERVAL);
  });


  function doSplitting(nextRunInterval) {
    if (nextRunInterval < STOP_RUNNING_INTERVAL) {
      return;
    }

    var team1 = [];
    var team2 = [];
    teams = [
      {
        id: 1,
        name: 'Team A',
        members: team1
      },
      {
        id: 2,
        name: 'Team B',
        members: team2
      }
    ];

    var groups = $('.groups-list > li');

    groups.each(function(_, group) {
      var memberInps = $(group).find('input');
      var memberIndexes = [];
      var memberNames = [];

      memberInps.each(function(i, memberInp) {
        var memberName = $(memberInp).val().trim();

        if (memberName) {
          memberIndexes.push(i);
          memberNames.push(memberName);
        }
      });

      var numPairs = Math.ceil(memberNames.length / 2);
      var group1MemberIndexes = [];

      while (numPairs > 0) {
        var random = Math.random();
        var randomIndex = window.parseInt(random * 1e6) % memberIndexes.length;
        group1MemberIndexes.push(memberIndexes[randomIndex]);
        memberIndexes.splice(randomIndex, 1);
        numPairs--;
      }

      memberInps.each(function(i, memberInp) {
        if (group1MemberIndexes.includes(i)) {

          team1.push(memberNames[i]);
          $(memberInp).next().text('A');
        } else if (memberIndexes.includes(i)) {

          team2.push(memberNames[i]);
          $(memberInp).next().text('B');
        }
      });
    });

    generateAllTeams(teams);

    window.setTimeout(function() {
      doSplitting(nextRunInterval * 0.95);
    }, nextRunInterval);
  }

  
  function loadGroupData() {
    $.getJSON("/resources/ces_fc.json", function(data) {
      generateAllGroups(data);
    });
  }


  function generateAllGroups(data) {

    var list = $('.groups-list');

    var theTemplateScript = $('#group-template').html();

    //Compile the template​
    var theTemplate = Handlebars.compile(theTemplateScript);
    list.append(theTemplate(data));
  }


  function generateAllTeams(data) {
    $('.teams-list > li').remove();

    var $list = $('.teams-list');

    var theTemplateScript = $('#team-template').html();

    //Compile the template​
    var theTemplate = Handlebars.compile(theTemplateScript);
    $list.append(theTemplate(data));

    $list.html(function (index, html) {
      return html.replace(/\u200B/g, "");
    });
  }

  loadGroupData();

  var page = $('.all-groups');
  page.addClass('visible');
});