require.config({
    baseUrl: "/static/app/jquery/js/contrib/",
    paths: {
        "app": "..",
        "underscore": "underscore",
        "backbone": "backbone",
        "d3": "d3.v3",
        "spinner": "spin.min"
    },
    shim: {
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "d3": {
            exports: "d3"
        }
    }
});

require([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "app/collections/Interact.Collection",
    "app/views/InteractContainer.View",
    "app/collections/Popularity.Collection",
    "app/views/PopularityContainer.View",
    "app/collections/Funnel.Collection",
    "app/views/FunnelContainer.View"
], function(
    $,
    _,
    Backbone,
    d3,
    InteractCollection,
    InteractContainer,
    PopularityCollection,
    PopularityContainer,
    FunnelCollection,
    FunnelContainer
) {

    var app = {};
    app.colors = {yellow: "#b58900", green: "#859900", orange: "#cb4b16", 
        cyan: "#2aa198", red: "#dc322f", blue: "#268bd2", 
        magenta: "#d33682", violet: "#6c71c4"};
    app.tones = {base2: "#eee8d5", base3: "#fdf6e3"};
    app.spinnerOpts = {lines: 9, // The number of lines to draw
        length: 5, // The length of each line
        width: 3, // The line thickness
        radius: 6, // The radius of the inner circle
        color: app.colors.cyan};

    /* length is the length of time a user was browsing the section, denoted in minutes */
    var selections = {"Any 15 user interactions": ["Last 15 interaction navigation", "Last 15 interaction click"],
        "Ticket purchaser interactions": ["Purchaser interaction navigation", "Purchaser interaction click"]},
        interactContainer = new InteractContainer({
            collection: new InteractCollection(), 
            app: app, selections: selections});
    interactContainer.collection.fetch();
    // window.setInterval(function() {
    //     interactContainer.collection.fetch();
    // }, 15000);
    
    var popularityContainer = new PopularityContainer({
        collection: new PopularityCollection(),
        app: app
    });
    popularityContainer.collection.fetch();
    // semi real-time
    // window.setInterval(function() {
    //     popularityContainer.collection.fetch();
    // }, 5000);

    var funnelContainer = new FunnelContainer({
        collection: new FunnelCollection(),
        app: app
    });
    funnelContainer.collection.fetch();
    // window.setInterval(function() {
    //     funnelContainer.collection.fetch();
    // }, 30000);

    window.app = app;
});