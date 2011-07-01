var PaginatedView = Backbone.View.extend({
  initialize: function(){
    typeof(options) != 'undefined' || (options = {})
    if(options.collection)
      this.collection = options.collection
    if(options.modelView)
      this.modelView = options.modelView
    this.$('.loading').waypoint('destroy')
    _.bindAll(this, "render", "update", "nextPage", "waypoint")
    this.render()
    this.$('.loading img').show()
    this.collection.page = 1
    this.collection.bind("refresh", this.update)
    this.collection.fetch()
  },
  waypoint: function(event, direction){
    if(!this.$('.loading img').is(":visible")){
      this.$('.loading').waypoint('remove')
      if(direction == "down")
        this.nextPage()
    }
  },
  nextPage: function(){
    if(!this.collection.isEmpty()) {
      this.$('.loading img').show()
      this.collection.nextPage()
    }
  },
  render: function() {
    this.$('.items').html("")
    return this
  },
  update: function(){
    this.$('.loading img').hide()
    if(!this.collection.isEmpty()) {
      this.collection.each(function(model){
        var item = $('<div class="item">')
        this.$('.items').append(item)
        new this.modelView({el: item, model: model})        
      }, this)
    } else if(this.collection.page == 1) {
      this.$('.empty').show()
    }
    this.$('.loading').waypoint(this.waypoint, {offset: "100%"})
    return this
  }
})
