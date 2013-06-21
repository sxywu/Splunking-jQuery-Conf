define([
	"d3"
], function(
	d3
) {
	// default width and height
	return function() {
		var width = 100,
			height = 75,
			margin = 50,
			color = "#cfcfcf",
			html = "", 
			parent,
			insertBefore,
			arrw; // d3 wrapped element

		function arrow() {
			// idk what's supposed to happen in here
		}

		arrow.arrw = function() {
			return arrw;
		}

		arrow.render = function() {
			arrw = d3.select(parent)
				.insert("span", insertBefore)
				.classed("arrow", true)
				.style("width", width + (height / 2))
				.style("display", "inline-block");
			arrw.append("span")
				.style("width", width)
				.style("height", height)
				.style("position", "absolute")
				.html(html);
			arrw.append("span")
				.style("width", width)
				.style("height", height)
				.style("background-color", color)
				.style("display", "inline-block");
			arrw.append("span")
				.style("width", 0)
				.style("height", 0)
				.style("border-top", (height / 2) + "px solid transparent")
				.style("border-bottom", (height / 2) + "px solid transparent")
				.style("border-left", (height / 2) + "px solid " + color)
				.style("display", "inline-block");
			arrw.append("span")
				.style("width", width)
				.style("height", height)
				.style("display", "inline-block");
			//console.log(height + "px solid " + color);
			return arrow;
		}

		arrow.remove = function() {
			arrw.remove();
		}

		arrow.parent = function(val) {
			if (!arguments.length) return parent;
			parent = val;
			return arrow;
		}

		arrow.insertBefore = function(val) {
			if (!arguments.length) return insertBefore;
			insertBefore = val;
			return arrow;
		}

		// style attributes
		arrow.containerWidth = function() {
			return width + (height/2);
		}

		arrow.width = function(val) {
			if (!arguments.length) return width;
			width = val;
			return arrow;
		}

		arrow.height = function(val) {
			if (!arguments.length) return height;
			height = val;
			return arrow;
		}

		arrow.color = function(val) {
			if (!arguments.length) return color;
			color = val;
			return arrow;
		}

		arrow.html = function(val) {
			if (!arguments.length) return html;
			html = val;
			return arrow;
		}

		return arrow;
	}
	
});