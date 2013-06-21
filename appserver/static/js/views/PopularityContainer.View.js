define([
	"jquery",
	"underscore",
	"backbone",
	"d3",
	"spinner",
	"app/views/Popularity.View",
	"app/visualizations/Rectangle.Visualization",
	"app/visualizations/Circle.Visualization"
], function(
	$,
	_,
	Backbone,
	d3,
	Spinner,
	PopularityView,
	Rectangle,
	Circle
) {
	return Backbone.View.extend({
		el: "#popularity",
		initialize: function() {
			this.app = this.options.app;
			this.collection = this.options.collection;
			this.speakerScale = d3.scale.linear();
			this.talkScale = d3.scale.linear();

			this.views = {};

			this.spinner = new Spinner(this.app.spinnerOpts).spin(this.el);

			var that = this;
			this.collection.on("reset", function(collection) {
				that.spinner.stop();
				that.updateScale();
				that.removeAll();
				that.renderAll();
			});
		},
		updateScale: function() {
			if (this.collection.isEmpty()) {
				return;
			}
			// speaker scale
			var models = _.filter(this.collection.models, function(model) {
					return model.get("type") === "speaker";
				}),
				max = _.max(models, function(model) {
					return parseInt(model.get("reads"), 10);
				}),
				width = (this.$el.width() / 2) - 100;
			if (models.length === 0) return;
			this.speakerScale.domain([0, parseInt(max.get("reads"), 10)]).range([0, width]);

			// talk scale
			models = _.filter(this.collection.models, function(model) {
				return model.get("type") === "talk";
			});
			max = _.max(models, function(model) {
				return parseInt(model.get("reads"), 10);
			});
			if (models.length === 0) return;
			this.talkScale.domain([0, parseInt(max.get("reads"), 10)]).range([0, width]);

		},
		removeAll: function() {
			// remove previous elements
			_.each(this.views, function(view) {
				view.clear();
			});
			this.views = {};
		},
		renderAll: function() {

			// add in new ones
			var that = this;
			this.collection.each(function(model) {
				that.renderOne(model);
			});
		},
		renderOne: function(model) {
			var view;
			if (model.get("type") === "speaker") {
				view = new PopularityView({model: model, app: this.app, scale: this.speakerScale});
				this.$("#popularitySpeakers").append(view.render().el);
			} else if (model.get("type") === "talk") {
				view = new PopularityView({model: model, app: this.app, scale: this.talkScale});
				this.$("#popularityTalks").append(view.render().el);
			}
			this.views[model.id] = view;
		},
		removeOne: function(model) {
			var view = this.views[model.id];
			view.clear();
			delete this.views[model.id];
		}
	});
});