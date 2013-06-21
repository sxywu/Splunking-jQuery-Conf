define([
	"jquery",
	"underscore",
	"backbone",
	"app/models/Popularity.Model"
], function(
	$,
	_,
	Backbone,
	PopularityModel
) {
	/* 
		a collection of InteractModels, where each model is a user's interaction timeline
		keeps track of resets, additions and removals of the models
	*/

	var searches = ["Most popular speakers", "Most popular talks", "Index talks speakers"],
		formatResults = function(results) {
			var talks = [],
				index = {},
				speakers = {},
				formattedResults = [];
			_.each(results, function(result) {
				if (result.type === "talk") {
					talks.push(result);
				} else if (result.type === "speaker") {
					speakers[result.name] = result;
				} else if (result.type === "index") {
					index[result.talk] = result.speaker;
				}
			});
			talks = _.sortBy(talks, function(talk) {
				return -parseInt(talk.reads);
			});
			_.each(talks, function(talk) {
				formattedResults.push(talk);
				var speaker = speakers[index[talk.name]];
				formattedResults.push(speaker);
			});

			return formattedResults;
		};

	return Backbone.Collection.extend({
		model: PopularityModel,

		sync: function(method, collection, options) {
			var search, i, l,
				models = [];
				flags = 0;

			// *****************************
			// Only 'read' is supported:
			// read-only collection w/o server persistency
			// *****************************
			if (method != "read") {
				return;
			}

			_.each(searches, function(search) {
				var searchString = '| savedsearch "' + search + '"';
				$.ajax({
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded',
					url: "/en-US/splunkd/servicesNS/nobody/jquery/search/jobs",
					data: {
						'search': searchString,
						'output_mode': 'json',
						'exec_mode': 'oneshot'
					}
				}).done(function(data) {
					var results = data && data.results;

					if (!results) {
						errMsg = "Unknown response format for job " + results;
			            console.warn(errMsg);
			            options.error(errMsg);
			            return;
					}
					if ($.isArray(results) && results.length > 0) {
                    	models = models.concat(results);
                    }
                    flags += 1;
                    if (flags == searches.length) {
                    	console.log("Refreshing popularity data...");
                    	collection.reset(formatResults(models));
					}
				});
			});
		}
	});
});