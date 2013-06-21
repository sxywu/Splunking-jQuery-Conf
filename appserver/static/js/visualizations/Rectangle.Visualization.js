define([
	"d3"
], function(
	d3
) {
	// default width and height
	return function() {
		var width = 100,
			height = 10,
			color = "#cfcfcf", 
			parent,
			insertBefore,
			className = "",
			rect,
			mouseover = function() {},
			mouseleave = function() {}; 

		// rectangle one rectangle, given the parent element
		function rectangle() {
			// idk what's supposed to happen in here
		}

		rectangle.rect = function() {
			return rect;
		}

		rectangle.render = function() {
			rect = d3.select(parent)
				.insert("span", insertBefore)
				.attr("class", className)
				.style("width", width)
				.style("height", height)
				.style("background-color", color)
				.style("display", "inline-block")
				.style("margin", 1)
				.style("cursor", "pointer")
				.on("mouseover", mouseover)
				.on("mouseleave", mouseleave);

			return rectangle;
		}

		rectangle.remove = function() {
			rect.remove();
		}

		rectangle.parent = function(val) {
			if (!arguments.length) return parent;
			parent = val;
			return rectangle;
		}

		rectangle.insertBefore = function(val) {
			if (!arguments.length) return insertBefore;
			insertBefore = val;
			return rectangle;
		}

		// style attributes
		rectangle.width = function(val) {
			if (!arguments.length) return width;
			width = val;
			return rectangle;
		}

		rectangle.height = function(val) {
			if (!arguments.length) return height;
			height = val;
			return rectangle;
		}

		rectangle.color = function(val) {
			if (!arguments.length) return color;
			color = val;
			return rectangle;
		}

		rectangle.classed = function(val) {
			if (!arguments.length) return className;
			className = val;
			return rectangle;
		}

		rectangle.mouseover = function(e) {
			if (!arguments.length) return mouseover;
			mouseover = e;
			return rectangle;
		}

		rectangle.mouseleave = function(e) {
			if (!arguments.length) return mouseleave;
			mouseleave = e;
			return rectangle;
		}

		return rectangle;
	}
	
});