define([
	"jquery",
	"underscore",
	"backbone",
	"app/visualizations/Rectangle.Visualization"
], function(
	$,
	_,
	Backbone,
	Rectangle
) {
	return Backbone.View.extend({
		className: "funnelBar",
		initialize: function() {
			this.app = this.options.app;
			this.model = this.options.model;
			this.scale = this.options.scale;
			this.colors = this.options.colors;

			this.margin = 50;
		},
		render: function() {
			var that = this;
			_.each(this.model.attributes.properties, function(property) {
				var className = property.value.replace(/[\.\/\?\=]/g, ""),
					mouseover = function() {
						$(".arrow .text").addClass("unhighlight");
						$(".funnelBar, #funnelLegend .legend").children().addClass("unhighlight");
						$("." + className).removeClass("unhighlight");

						console.log(that.model);
						text = '<div class="text">';
						text += property.value + "<br>";
						text += property.count + " " + that.model.get("name");
						text += '</div>';
						$("#funnelHover").html(text);
					};
				Rectangle().parent(that.el)
					.classed(className).mouseover(mouseover)
					.height(that.scale(property.logCount))
					.width(5).color(that.colors[property.value])
					.render();
			});

			this.$el.css("margin", "0 " + this.margin);
			return this;
		},
		width: function() {
			//console.log(this.el, this.$el.outerWidth(), this.$el.css("margin"));
			return this.$el.width() + 2 * this.margin;
		},
		clear: function() {
			this.$el.remove();
		},
		events: {
			"mouseleave": "mouseleave"
		},
		mouseleave: function() {
			$("#funnelHover").html("");
		},
	});
});
