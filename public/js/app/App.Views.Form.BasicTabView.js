;(function() {	
	"use strict";
	owid.namespace("App.Views.Form.BasicTabView");

	App.Views.Form.BasicTabView = owid.View.extend({

		el: "#form-view #basic-tab",
		events: {
			"input input[name=chart-name]": "onNameInput",
			"change input[name=chart-name]": "onNameChange",
			"change input[name=chart-slug]": "onSlugChange",
			"change textarea[name=chart-subname]": "onSubnameChange",
			"change textarea[name=chart-footer-note]": "onFooterNoteChange",	
			"change textarea[name=chart-notes]": "onNotesChange"			
		},

		initialize: function(options) {
			if (window.location.hash === "")
				window.location.hash = "#basic-tab";

			this.dispatcher = options.dispatcher;
			this.render();
		},

		render: function() {
			this.$chartName = this.$el.find("[name=chart-name]");
			this.$chartSlug = this.$el.find("[name=chart-slug]");
			this.$chartSubname = this.$el.find("[name=chart-subname]");
			this.$chartFooterNote = this.$('[name=chart-footer-note]');
			this.$chartInternalNotes = this.$el.find("[name=chart-notes]");

			this.$chartName.val(App.ChartModel.get("chart-name"));
			this.$chartSlug.val(App.ChartModel.get("chart-slug"));
			this.$chartSubname.val(App.ChartModel.get("chart-subname"));
			this.$chartFooterNote.val(App.ChartModel.get('chart-description'));
			this.$chartInternalNotes.val(App.ChartModel.get("chart-notes"));
		},

		convertToSlug: function(s) {
			s = s.toLowerCase().replace(/\s*\*.+\*/, '').replace(/[^\w- ]+/g,'');
			return $.trim(s).replace(/ +/g,'-');
		},

		onNameInput: function() {
			var currentName = this.lastChartName || App.ChartModel.get("chart-name") || "";
			var currentExpectedSlug = this.convertToSlug(currentName);
			var currentSlug = this.$chartSlug.val();

			// We only automatically update the slug to match title if it's an unpublished chart, to discourage changing them later
			// Also if the user manually enters a slug we should honour that and not change it
			if (!App.ChartModel.get("published") && (_.isEmpty(currentSlug) || currentExpectedSlug == currentSlug)) {
				var slug = this.convertToSlug(this.$chartName.val());
				this.$chartSlug.val(slug);
				this.onSlugChange();				
			}

			this.lastChartName = this.$chartName.val();
		},

		onNameChange: function() {
			App.ChartModel.set("chart-name", this.$chartName.val());
		},

		onSlugChange: function() {
			App.ChartModel.set("chart-slug", this.$chartSlug.val());
		},

		onSubnameChange: function() {
			App.ChartModel.set("chart-subname", this.$chartSubname.val());
		},

		onNotesChange: function() {
			App.ChartModel.set("chart-notes", this.$chartInternalNotes.val());
		},

		onFooterNoteChange: function() {
			App.ChartModel.set("chart-description", this.$chartFooterNote.val());
		}
	});
})();
