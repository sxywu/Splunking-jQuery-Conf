define([
	"jquery",
	"underscore",
	"backbone",
	"d3",
	"spinner",
	"app/views/Interact.View",
	"app/visualizations/Rectangle.Visualization",
	"app/visualizations/Circle.Visualization"
], function(
	$,
	_,
	Backbone,
	d3,
	Spinner,
	InteractView,
	Rectangle,
	Circle
) {
	return Backbone.View.extend({
		el: "#interacting",
		initialize: function() {
			this.app = this.options.app;
			this.collection = this.options.collection;
			this.selections = this.options.selections;
			this.views = {};
			this.colorArray = _.values(this.app.colors);
			this.colors = {};
			this.scale = d3.scale.linear();

			this.renderSelect();
			this.setSelect();

			this.spinner = new Spinner(this.app.spinnerOpts).spin(this.el);

			var that = this;
			this.collection.on("reset", function(collection) {
				that.spinner.stop();
				that.updateScale();
				that.updateColors();
				that.updateLegend();
				that.setChartWidth();
				that.renderAll();
			});
		},
		renderSelect: function() {
			var that = this;
			_.each(this.selections, function(val, key) {
				var $option = $("<option></option").text(key);
				that.$("#interactingSelect").append($option);
			});
		},
		setSelect: function() {
			console.log(this.$("#interactingSelect").val());
			var val = this.$("#interactingSelect").val();
			this.collection.setSearches(this.selections[val]);
		},
		updateScale: function() {
			var that = this,
				max = _.max(_.map(this.collection.models, function(model) {
					var sum = _.reduce(model.attributes, function(m, obj) {
						if (obj.event === "Navigate Section") {
							// todo: perhaps not use parseFloat?
							return m + parseFloat(obj.length);
						} else {
							return m;
						}
					}, 0);
					return sum;
				})),
				width = this.$("#interactingChart").width();

			this.scale.domain([0, max]).range([0, width]);

		},
		updateColors: function() {
			var that = this,
				length = this.colorArray.length - 1,
				sections = _.chain(this.collection.models)
					.map(function(model) {
						return _.filter(_.pluck(model.attributes, "section"), function(section) {
							return !_.isUndefined(section);
						});
					}).flatten().uniq().value(),
				clicks = _.chain(this.collection.models)
					.map(function(model) {
						return _.filter(_.pluck(model.attributes, "event"), function(event) {
							return !_.isUndefined(event) && event.match(/Click/);
						});
					}).flatten().uniq().value();

			_.each(clicks, function(click, i) {
				that.colors[click] = that.colorArray[length - i];
			});
			_.each(sections, function(section, i) {
				that.colors[section] = that.colorArray[i];
			});
			
		},
		updateLegend: function() {
			var that = this;
			_.each(this.colors, function(color, text) {
				var className = text.replace(/ /g, "_"),
					mouseover = function() {
						that.$(".interactingBar, .legend").children().addClass("unhighlight");
						that.$("." + className).removeClass("unhighlight");
					},
					mouseleave = function() {
						// that.$(".interactingBar, .legend").children().removeClass("unhighlight");
					};
				if (text.match(/Click/)) {
					that.circleLegend(text, color, className, mouseover, mouseleave);
				} else {
					that.rectLegend(text, color, className, mouseover, mouseleave);
				}
			});
		},
		circleLegend: function(text, color, className, mouseover, mouseleave) {
			var $legend = $("<div class='legend'></div>"),
				$legendKey = $("<span class='text inverted text-left " + className + "'>" + text + "</span>");
			$legend.mouseover(mouseover);
			this.$("#interactingLegend").append($legend);
			Circle().parent($legend[0])
				.classed(className).mouseover(mouseover).mouseleave(mouseleave)
				.radius(5).color(color).render(className);
			$legend.append($legendKey);

		},
		rectLegend: function(text, color, className, mouseover, mouseleave) {
			var $legend = $("<div class='legend'></div>"),
				$legendKey = $("<span class='text inverted text-left " + className + "'>" + text + "</span>");
			$legend.mouseover(mouseover);
			this.$("#interactingLegend").append($legend);

			Rectangle().parent($legend[0])
				.classed(className).mouseover(mouseover).mouseleave(mouseleave)
				.width(10).height(10).color(color).render();
			$legend.append($legendKey);
		},
		setChartWidth: function() {
			var width = this.$el.width() - this.$("#interactingLegend").outerWidth() - 5;
			this.$("#interactingChart").width(width);
			this.$("#interactingHover").width(this.$("#interactingLegend").width());
			this.$("#interactingSelect").width(this.$("#interactingLegend").width());
		},
		removeAll: function() {
			// remove previous elements
			_.each(this.views, function(view) {
				view.clear();
			});
			this.views = {};
			this.$("#interactingLegend").empty();
		},
		renderAll: function() {
			// add in new ones
			var that = this;
			this.collection.each(function(model) {
				that.renderOne(model);
			});
			
		},
		renderOne: function(model) {
			var view = new InteractView(
				{app: this.app, model: model, 
					scale: this.scale, colors: this.colors});
			this.$("#interactingChart").append(view.render().el);
			this.views[model.id] = view;
		},
		removeOne: function(model) {
			var view = this.views[model.id];
			view.clear();
			delete this.views[model.id];
		},
		events: {
			"mouseleave #interactingLegend": "mouseleave",
			"change #interactingSelect": "changeSelect"
		},
		mouseleave: function() {
			this.$(".interactingBar, .legend").children().removeClass("unhighlight");
		},
		changeSelect: function() {
			this.setSelect();
			this.removeAll();
			this.spinner = new Spinner(this.app.spinnerOpts).spin(this.el);
			this.collection.fetch();
		}
	});
});