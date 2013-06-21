define([
	"jquery",
	"underscore",
	"backbone",
	"text!app/templates/Popularity.Template.html",
	"app/visualizations/Rectangle.Visualization",
	"app/visualizations/Circle.Visualization"
], function(
	$,
	_,
	Backbone,
	Template,
	Rectangle,
	Circle
) {
	return Backbone.View.extend({
		className: "popularityBar",
		initialize: function() {
			this.app = this.options.app;
			this.model = this.options.model;
			this.scale = this.options.scale;
		},
		render: function() {
			
			var attrs = this.model.attributes,
				barColor, insertBefore;
			if (attrs.type === "speaker") {
				attrs.color = "blue";
				attrs.reads_color = "";
				attrs.textAlign = "text-left";
				attrs.align = "left";
				insertBefore = ".popularityReads";
				barColor = this.app.tones.base3;
			} else if (attrs.type === "talk") {
				attrs.textAlign = "text-right";
				attrs.align = "right"
				attrs.color = "";
				attrs.reads_color = "blue";
				barColor = this.app.colors.blue;
			}
			this.$el.html(_.template(Template, attrs));		
			Rectangle().parent(this.$(".popularityRect")[0])
				.insertBefore(insertBefore)
				.width(this.scale(attrs.reads))
				.height(5).color(barColor)
				.render();
			return this;
		},
		clear: function() {
			this.$el.remove();
		},
		events: {
			"mouseover .popularityText": "mouseover",
			"mouseleave .popularityText": "mouseleave"
		},
		mouseover: function() {
			this.$(".popularityText").removeClass("truncated");
		},
		mouseleave: function() {
			this.$(".popularityText").addClass("truncated");
		}
	});
});