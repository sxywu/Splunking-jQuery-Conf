define([
	"jquery",
	"underscore",
	"backbone",
	"app/visualizations/Rectangle.Visualization",
	"app/visualizations/Circle.Visualization"
], function(
	$,
	_,
	Backbone,
	Rectangle,
	Circle
) {
	return Backbone.View.extend({
		className: "interactingBar",
		initialize: function() {
			this.app = this.options.app;
			this.model = this.options.model;
			this.scale = this.options.scale;
			this.colors = this.options.colors;
		},
		render: function() {
			var that = this,
				text,
				mouseover,
				mouseleave = function() {
					// $("#interactingHover").html("");
				};
			_.each(this.model.attributes, function(model) {
				if (_.isUndefined(model.event)) {
					return;
				}
				if (model.event.match(/Click/)) {
					mouseover = function() {
						text = '<div class="text">';
						text += model.event + '<br><br>"';
						text += model.text || model.title || model.speaker;
						text += '"</div>';
						$("#interactingHover").html(text);
					}
					var circ = Circle().parent(that.el)
						.classed(model.event.replace(/ /g, "_"))
						.radius(4).color(that.colors[model.event])
						.mouseover(mouseover).mouseleave(mouseleave)
						.render();

					
				} else if (model.event === "success") {
					mouseover = function() {
						text = '<div class="text">';
						text += model.event + '!';
						text += '</div>';
						$("#interactingHover").html(text);
					}
					var circ = Circle().parent(that.el)
						.classed(model.event.replace(/ /g, "_"))
						.radius(5).color(that.app.colors.red)
						.mouseover(mouseover).mouseleave(mouseleave)
						.render();
				} else if (model.event !== "pageview") {
					mouseover = function() {
						// too lazy to make another template.  should eventually.
						text = "<div class='text'>";
						text += model.event + ": " + model.section + "<br>";
						text += "length: " + (parseFloat(model.length) / 60).toFixed() + "m " + (parseFloat(model.length) % 60).toFixed() + "s";
						text += "</div>"
						$("#interactingHover").html(text);
					}
					var rect = Rectangle().parent(that.el)
						.classed(model.section.replace(/ /g, "_"))
						.width(that.scale(model.length))
						.height(7.5).color(that.colors[model.section])
						.mouseover(mouseover).mouseleave(mouseleave)
						.render();
				}
			});

			return this;
		},
		events: {
			"mouseleave": "mouseleave"
		},
		mouseleave: function() {
			$("#interactingHover").html("");
		},
		clear: function() {
			this.$el.remove();
		}
	});
});