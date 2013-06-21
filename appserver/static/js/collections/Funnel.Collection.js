define([
	"jquery",
	"underscore",
	"backbone",
	"app/models/Funnel.Model"
], function(
	$,
	_,
	Backbone,
	FunnelModel
) {
	/* 
		a collection of InteractModels, where each model is a user's interaction timeline
		keeps track of resets, additions and removals of the models
	*/

	// var search = "Click-Buy to Purchase funnel by Location";
	// var funnel = {
	// 	property: 'location',
	// 	events: ['clicks', 'purchases']
	// };

	var search = "Pageview to Click-Buy to Purchase funnel by Referrer";
	var funnel = {
		property: 'referrer',
		events: ['pageviews', 'clicks', 'purchases']
	};

	var convertRowsToFunnelStages = function(rows) {
		var stages = [], values,
			stage, event, i, l,
			propValueToRowIdx;

		values = _.pluck(rows, funnel.property);
		valueToIndex = _.reduce(rows, function(o,row,idx){
			o[row[funnel.property]] = idx; return o
		},{});

		for(i=0, l=funnel.events.length; i < l; i+=1) {
			var event = funnel.events[i];
			stage = {
				name: event,
				properties: _.map(values, function(value) {
					return {
						value: value,
						logCount: Math.log(parseInt(rows[valueToIndex[value]][event], 10)) / Math.log(10),
						count: rows[valueToIndex[value]][event]
					};
				})
			}
			stages.push(stage);
		}
		return stages;
	};

	return Backbone.Collection.extend({
		model: FunnelModel,

		sync: function(method, collection, options) {

			// *****************************
			// Only 'read' is supported:
			// read-only collection w/o server persistency
			// *****************************
			if (method != "read") {
				return;
			}

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
                	console.log("Refreshing funnel data...");
                	collection.reset(convertRowsToFunnelStages(results));
                }
			});
		}
	});
});
