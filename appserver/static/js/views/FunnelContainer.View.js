define([
	"jquery",
	"underscore",
	"backbone",
	"d3",
	"spinner",
	"app/views/Funnel.View",
	"text!app/templates/FunnelText.Template.html",
	"text!app/templates/FunnelDescription.Template.html",
	"app/visualizations/Rectangle.Visualization",
	"app/visualizations/Arrow.Visualization"
], function(
	$,
	_,
	Backbone,
	d3,
	Spinner,
	FunnelView,
	FunnelTextTemplate,
	FunnelDescriptionTemplate,
	Rectangle,
	Arrow
) {
	return Backbone.View.extend({
		el: "#funnel",
		initialize: function() {
			this.app = this.options.app;
			this.collection = this.options.collection;
			this.scale = d3.scale.linear();
			this.views = {};
			this.colors = {};
			this.colorArray = _.values(this.app.colors);

			this.spinner = new Spinner(this.app.spinnerOpts).spin(this.el);

			var that = this;
			this.collection.on("reset", function(collection) {
				that.spinner.stop();
				that.removeAll();
				that.updateScale();
				that.updateColors();
				that.updateLegend();
				that.renderAll();

				that.setWidth();
			});
		},
		updateScale: function() {
			var that = this,
				max = _.chain(this.collection.models)
					.map(function(model) {
						return _.pluck(model.attributes.properties, "logCount");
					}).flatten().max().value();
			this.scale.domain([0, max]);
			this.scale.range([0, 500]);
		},
		updateColors: function() {
			var that = this,
				length = this.colorArray.length,
				values = _.chain(this.collection.models)
					.map(function(model) {
						return _.pluck(model.attributes.properties, "value");
					}).flatten().uniq().value();

			_.each(values, function(value, i) {
				that.colors[value] = that.colorArray[(i * 3 + 1) % length];
			});
		},
		updateLegend: function() {
			var first = _.first(this.collection.models),
				last = _.last(this.collection.models),
				that = this;
			_.each(first.attributes.properties, function(property1) {
				var text = property1.value + " ",
					property2 = _.filter(last.attributes.properties, function(p2) {
						return p2.value === property1.value;
					})[0],
					percent = parseInt(property2.count, 10) / parseInt(property1.count, 10),
					color = that.colors[property1.value],
					className = property1.value.replace(/[\.\/\?\=]/g, "");
				text += "(" + (percent * 100).toFixed(2) + "%)";
				var $legend = $("<div class='legend'></div>"),
					$legendKey = $("<span class='text inverted text-left " + className + "'>" + text + "</span>"),
					mouseover = function() {
						that.$(".arrow .text").addClass("unhighlight");
						that.$(".funnelBar, .legend").children().addClass("unhighlight");
						that.$("." + className).removeClass("unhighlight");
					};
				$legend.mouseover(mouseover);
				this.$("#funnelLegend").append($legend);

				Rectangle().parent($legend[0])
					.classed(className).mouseover(mouseover)
					.width(10).height(10).color(color).render();
				$legend.append($legendKey);
			});

		},
		setWidth: function() {
			var width = this.$el.width() - this.$("#funnelChart").outerWidth() - 25;
			this.$("#funnelLegend").width(width);
			this.$("#funnelHover").width(width - 40);
		},
		removeAll: function() {
			// remove previous elements
			_.each(this.views, function(view) {
				view.clear();
			});
			this.views = {};

			this.$("#funnelLegend").empty();
			this.$("#funnelChart").empty();
			this.$("#funnelFooter").empty();
		},
		renderAll: function() {
			// add in new ones
			var that = this;
			this.collection.each(function(model, i) {
				// render arrow for every 2 models
				if (i > 0) {
					var html = "";
					_.each(model.attributes.properties, function(b2) {
						var bu1 = _.filter(that.collection.models[i - 1].attributes.properties, function(b1) {
							return b1.value === b2.value;
						})[0],
							percent = parseInt(b2.count, 10) / parseInt(bu1.count, 10),
							color = that.colors[b2.value],
							className = bu1.value.replace(/[\.\/\?\=]/g, "");
						percent = (percent * 100).toFixed(2) + "%";
						html += _.template(FunnelTextTemplate, 
							{className: className, text: percent, color: color});
						html += "<br>";
					});
					var arrow = Arrow().parent(that.$("#funnelChart")[0])
						.height(100).width(75).html(html)
						.color(that.app.tones.base2).render();
					var description = _.template(FunnelDescriptionTemplate, 
						{text: "", width: arrow.containerWidth()});
					that.$("#funnelFooter").append(description);
				}

				that.renderOne(model);
			});
		},
		renderOne: function(model) {
			var view = new FunnelView({model: model, app: this.app,
				colors: this.colors, scale: this.scale});
			this.$("#funnelChart").append(view.render().el);
			this.views[model.id] = view;

			var description = _.template(FunnelDescriptionTemplate, 
				{text: model.get("name"), width: view.width()});
			this.$("#funnelFooter").append(description);	
		},
		removeOne: function(model) {
			var view = this.views[model.id];
			view.clear();
			delete this.views[model.id];
		},
		events: {
			"mouseleave #funnelLegend": "mouseleave",
			"mouseleave .funnelBar": "mouseleave",
		},
		mouseleave: function() {
			this.$(".arrow .text").removeClass("unhighlight");
			this.$(".funnelBar, .legend").children().removeClass("unhighlight");
			
		}
	});
});