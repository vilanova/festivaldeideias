App.FbEvents = App.BaseView.extend({

  initialize: function (options) {
    _.bindAll(this);
  },

  formatDate: function (date) {
      var days, month, year, hours, minutes, prep;
      days = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();
      hours = date.getHours();
      minutes = date.getMinutes();
      days = days < 10 ? '0' + String(days) : days;
      prep = hours == 1 ? ' à ' : ' às ';
      minutes = minutes == 0 ? '' : (minutes < 10 ? '0' + String(minutes) : minutes);
      return days + '/' + month + '/' + year + prep + hours + 'h' + minutes + ' &middot;';
  },

  populateEventField: function (events) {
      var ul, li, i, length, e, date, now;
      now = new Date();
      if (events.constructor !== Array) { return; }
      ul = $('<ul></ul>');
      length = events.length;
      for (i = 0; i < length; ++i) {
          e = events[i];
          if (e.id) {
              // O formato do facebook é "2012-05-09T02:00:00"
              date = new Date(e.start_time.replace("T", " "));

              // Se a data do evento já tiver passado, não exibi-lo.
              if (date.valueOf() < now.valueOf()) {
                  continue;
              }

              li = "<li><a href='http://www.facebook.com/events/" + e.id + "' target='_blank'><div class='name'>" +
              e.name + "</div><div class='info'><span class='date'>" +
              this.formatDate(date) + "</span> <span class='date'>" + e.location + "</span></div></a></li>";
          } else {
              li = "<li><a href='http://www.facebook.com'>" + e.name + "</a></li>";
          }
          ul.append(li);
      }
      $('.fb_events').html(ul);
  },

  getEvents: function () {
    var view, token, query, now;
    view = this;
    now = parseInt((new Date()).getTime() / 1000);
    //token = window.accessToken;


    //query = "SELECT eid, name, start_time, location FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid=211024602327337) AND start_time > " + now + " ORDER BY start_time ASC LIMIT 10";

    FB.getLoginStatus(function (result) {
      if (result.status === "connected") {
        //FB.api({
          //method: 'fql.query',
          //query: query,
          //access_token: token
        //}, function (response) {
          //console.log(response);
          //view.populateEventField(response);
        //});
       
        //// Api antiga
        //FB.api({
          //method: 'events.get',
          //uid: 211024602327337 // <- Id do grupo
        //}, function (response) {
          //console.log(response);
          //view.populateEventField(response);
        //});

        //Usando a Graph API do Facebook 
        $.get("https://graph.facebook.com/219514234760244/events", {
          'access_token': FB.getAccessToken()
        }, function (data, textStatus) {
          console.log(data.data);
          view.populateEventField(data.data);
        }, 'json');

      } else {
        view.populateEventField([{
          name: "Você precisa estar conectado ao Facebook para ver os eventos"
        }]);
      }
    });


  }

});
