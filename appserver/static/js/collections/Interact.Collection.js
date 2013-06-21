define([
	"jquery",
	"underscore",
	"backbone",
	"app/models/Interact.Model"
], function(
	$,
	_,
	Backbone,
	InteractModel
) {
	/* 
		a collection of InteractModels, where each model is a user's interaction timeline
		keeps track of resets, additions and removals of the models
	*/
	var groupById = function(results) {
			results = _.sortBy(results, function(result) {
				return new Date(result._time);
			});
			var groups = _.groupBy(results, function(result) {
				return result.id;
			});
			groups = _.values(groups);
			results = [];
			groups = _.each(groups, function(group) {
				var without = _.chain(group)
					.filter(function(ev) {
						return ev.event === "Navigate Section";
					}).last().value();

				group = _.without(group, without);
				if (group.length > 0) {
					results.push(group);
				}
			});

			return results;
		};

	return Backbone.Collection.extend({
		model: InteractModel,
		setSearches: function(val) {
			this.searches = val;
		},
		sync: function(method, collection, options) {
			var searches = this.searches,
				models = [],
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
                    	console.log("Refreshing interaction data...");
                    	collection.reset(groupById(models));
					}
				});
			});
		}
	});
});