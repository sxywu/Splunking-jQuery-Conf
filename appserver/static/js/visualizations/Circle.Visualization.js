define([
	"d3"
], function(
	d3
) {
	// default width and height
	return function() {
		var radius = 5,
			color = "#cfcfcf", 
			parent,
			circ,
			className = "",
			mouseover = function() {},
			mouseleave = function() {};

		// circle one circle, given the parent element
		function circle() {
			// idk what's supposed to happen in here
		}

		circle.circ = function() {
			return circ;
		}

		circle.render = function() {
			circ = d3.select(parent).append("span")
				.attr("class", className)
				.style("width", radius * 2)
				.style("height", radius * 2)
				.style("border-radius", radius)
				.style("background-color", color)
				.style("display", "inline-block")
				.style("margin", 1)
				.style("cursor", "pointer")
				.on("mouseover", mouseover)
				.on("mouseleave", mouseleave);

			return circle;
		}

		circle.remove = function() {
			circ.remove();
		}

		circle.parent = function(val) {
			if (!arguments.length) return parent;
			parent = val;
			return circle;
		}

		// style attributes
		circle.radius = function(val) {
			if (!arguments.length) return radius;
			radius = val;
			return circle;
		}

		circle.color = function(val) {
			if (!arguments.length) return color;
			color = val;
			return circle;
		}

		circle.classed = function(val) {
			if (!arguments.length) return className;
			className = val;
			return circle;
		}

		circle.mouseover = function(e) {
			if (!arguments.length) return mouseover;
			mouseover = e;
			return circle;
		}

		circle.mouseleave = function(e) {
			if (!arguments.length) return mouseleave;
			mouseleave = e;
			return circle;
		}

		return circle;
	}
	
});