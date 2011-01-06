var ApplicationController = Backbone.Controller.extend({
  routes: {
    ':username/:docname': 'loadDocument',
    ':username/:docname/:node': 'loadDocument'
  },

  initialize: function() {
    
  },
  
  loadDocument: function(username, docname, node) {
    app.document.load(username, docname, node);
  }
});

var Application = Backbone.View.extend({
  
  events: {
    'click a.load-document': 'loadDocument',
    'click #shelf': 'showDocument',
    'click #browser_toggle': 'showBrowser',
    'click #document_toggle': 'showDocument',
    'click a.select-type': 'selectType'
  },
  
  selectType: function(e) {
    var type = $(e.currentTarget).attr('type');
    this.browser.documentType = type;
    this.browser.render();
    return false;
  },
  
  loadDocument: function(e) {
    app.document.load($(e.currentTarget).attr('user'), $(e.currentTarget).attr('name'));
    controller.saveLocation($(e.currentTarget).attr('href'));
    return false;
  },
  
  showDocument: function() {
    this.toggleView('document');
  },
  
  showBrowser: function() {
    this.toggleView('browser');
  },
  
  initialize: function(options) {
    var that = this;
    
    this.view = 'browser';
    this.shelf = new Shelf({el: '#sbs_shelf'});
    
    that.browser = new DocumentBrowser({
      el: '#browser',
      query: {'type|=': '/type/document', 'published_on!=': null}
    });
    
    // Init document
    that.document = new DocumentView({
      el: '#document_wrapper'
    });
  },
  
  // Toggle between document view and browser
  toggleView: function(view) {
    this.view = view;
    // $('#sbs_header').removeClass();
    // 
    // if (view === 'document') {
    //   $('#document_wrapper').show();
    //   $('#browser').hide();
    //   $('#sbs_header').addClass('document');
    // } else {
    //   $('#browser').show();
    //   $('#document_wrapper').hide();
    //   $('#sbs_header').addClass('browser');
    // }
  },
  
  render: function() {
    this.shelf.render();
  }
});

var app, controller;

Data.setAdapter('AjaxAdapter', {});

// The database
var graph = new Data.Graph(seed);

(function() {
  $(function() {
    // Start the browser
    app = new Application({el: $('#container')});
    app.render();
    
    // Register controller
    controller = new ApplicationController({app: app});
    Backbone.history.start();
  });
})();