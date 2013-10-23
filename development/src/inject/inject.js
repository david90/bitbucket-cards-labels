(function(){
  /* Styles */

  var setCustomStyle = function() {
    var current_milestone_col = $(".column-header:contains('Current Milestone')");
    if(!current_milestone_col.parent().hasClass("current-miliestone-col")){
      current_milestone_col.parent().addClass("current-miliestone-col");
    }

    var next_milestone_col = $(".column-header:contains('Next Milestone')");
    if(!next_milestone_col.parent().hasClass("next-miliestone-col")){
      next_milestone_col.parent().addClass("next-miliestone-col");
    }

    var next_milestone_col = $(".column-header:contains('On Hold')");
    if(!next_milestone_col.parent().hasClass("next-miliestone-col")){
      next_milestone_col.parent().addClass("next-miliestone-col");
    }

    var wip_col = $(".column-header:contains('WIP')");
    if(!wip_col.parent().hasClass("wip-col")){
      wip_col.parent().addClass("wip-col");
    }

    var wip_col = $(".column-header:contains('In Progress')");
    if(!wip_col.parent().hasClass("wip-col")){
      wip_col.parent().addClass("wip-col");
    }

    var qa_col = $(".column-header:contains('QA')");
    if(!qa_col.parent().hasClass("qa-col")){
      qa_col.parent().addClass("qa-col");
    }

    var resolved_col = $(".column-header:contains('Resolved')");
    if(!resolved_col.parent().hasClass("resolved-col")){
      resolved_col.parent().addClass("resolved-col");
    }

    var backlog_col = $(".column-header:contains('Backlog')");
    if(!backlog_col.parent().hasClass("backlog-col")){
      backlog_col.parent().addClass("backlog-col");
    }
  }

  /* Labels */
  var extractLabels = function(cardItem) {
    var title = cardItem.find("h2");
    var matched_labels = title.text().match(/\[[\w]+\]/ig);
    title.html(title.html().replace(/\[[\w]+\]/ig,""));
    var labels = matched_labels.map(function(match) { return match.slice(1, -1); })

    placeLabels(cardItem, labels);
  }

  // Add labels
  var placeLabels = function(cardItem, labels) {
    $.each(labels, function(index, value) {
      var new_label = $('<span class="label">');
      new_label.attr("data-label",value);
      new_label.css({"background-color":stringToColour(value)});
      new_label.appendTo(cardItem.find(".issue-content-container")).html(value);
    });
    calTotalHrs();
  }

  // TODO: Sort cards by label
  

  /* Usage: stringToColour(your_string)*/
  var stringToColour = function(str) {
    str = str.toLowerCase();
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }


  /* Label Filter */
  // Add filter text box
  var addFilterBox = function(){
    $("#project-title").append($('<input class="search" id="label-filter" placeholder="Label filter">'));
    $("#project-title").append($('<div class="search-count">'));
    $(".search-count").hide();
  }

  //Detect Filer text change
  var filterTextChangeHandler = function(e) {
    var filter_str = $(e.target).val()
    filterCards(filter_str);
  }

  // Show filter results
  var filterCards = function(filter_str){
    var search_count = $(".search-count");

    if(filter_str === undefined || filter_str.length == 0 || filter_str.toLowerCase() == "all") {
      $(".issue").slideDown(200);
      search_count.fadeOut(200);
      search_count.html("");
    } else {
      // Only show filtered cards
      $(".issue").hide();

      var valid_labels = $('.label').filter(function() {
          return $(this).data('label') && $(this).data('label').toLowerCase() === filter_str.toLowerCase();
      });

      search_count.fadeIn(200);
      count = valid_labels.length;
      search_count.html(""+count);

      if (count > 0) {
        search_count.addClass("valid");
        search_count.css({"background-color":stringToColour(filter_str)});
      } else {
        search_count.css({"background-color":""});
      }

      valid_labels.each(function(){
        $(this).closest(".issue").slideDown(200);
      });
    }
  }

  /* Total hrs */
  var addTotalHrsLayout = function(){
    var total_hrs_layout = $('<div class="total-hrs badge" title="Exculded items under Resolved column.">')
    $("body").append(total_hrs_layout);
    // total_hrs_layout.hide();
  }

  var getLabelHrs = function() {
      var hrs_labels = $('.label').filter(function() {
        $this = $(this);
        return $this.data('label') && $this.data('label').toLowerCase().match(/\d+hrs/i) && !$this.parents().is(".resolved-col");
      });
      return hrs_labels;
  }

  var calTotalHrs = function() {
    var hrs_array = getLabelHrs();
    var sum = 0;
    if (hrs_array !== undefined) {
      hrs_array.each(function(){
        var hr_str = $(this).text();
        var hr = hr_str.substring(0, hr_str.length - 3);
        var hr_int = parseInt(hr,10);
        sum += hr_int;
      });
    }
    $('.total-hrs').html("Hours Left: <i>"+ sum + " hrs</i>");
  }

  var updateTotalHrLayout = function() {

  }

  /* Add handlers */
  var columnAddedHandler = function(e) {
    target = $(e.target);
    if (target.hasClass("column")) {
      setCustomStyle();
    }
  }

  var cardAddedHandler = function(e) {
    target = $(e.target);
    if (target.hasClass("issue")) {
      extractLabels(target);
    }
  }


  /* Onload functions */ 
  var o_onload = window.onload || function () {};

  window.onload = function () {
    o_onload();
    addFilterBox();
    addTotalHrsLayout();
  }

  $("#columns").on("DOMNodeInserted", ".column", columnAddedHandler);
  $("#columns").on("DOMNodeInserted", ".issue", cardAddedHandler);

  $('body').on("input change", "#label-filter", filterTextChangeHandler)
})();
