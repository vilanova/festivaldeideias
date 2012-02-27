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
    var ul, li, i, length, e, date;
    if (events.constructor !== Array) { return; }
    ul = $('<ul></ul>');
    length = events.length;
    for (i = 0; i < length; ++i) {
      e = events[i];
      // e.start_time está em segundos e precisa ser convertido para
      // milisegundos para se adequar ao construtor do Date.
      date = new Date(Number(e.start_time) * 1000);

      li = "<li><a href='http://www.facebook.com/events/" + e.eid + "' target='_blank'><div class='name'>" +
      e.name + "</div><div class='info'><span class='date'>" +
      this.formatDate(date) + "</span> <span class='date'>" + e.location + "</span></div></a></li>";
      ul.append(li);
    }
    $('.fb_events').html(ul);
  },

  getEvents: function () {
    var view, token, query;
    view = this;
    // Ganhei o token de um dos meus app numa página que fornece tokens para teste. Não sei se expira
    token = "AAAEirF16n5EBAIwqRbZAEFUZCX8IzK2xqTlyQ5Bv2QcRSGdTcU2AYwQOnVr0u5SoNnVPS6xY97H8DZBxu5tJ1EZBA0FZAc2sNKcWLLMHdSOL9c6sCZA5H3";
    query = "SELECT eid, name, start_time, location FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid=211024602327337) ORDER BY start_time DESC LIMIT 10";
    // Usando a Graph API do Facebook
    // Aparentemente a API REST (legacy) não está funcionando direito.
    $.get("https://graph.facebook.com/fql", {
      'q': query,
      'access_token': token
    }, function (data, textStatus) {
      view.populateEventField(data.data);
    }, 'json');
  }

});
