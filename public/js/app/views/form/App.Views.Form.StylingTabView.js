;( function() {
	
	"use strict";

	App.Views.Form.StylingTabView = Backbone.View.extend({

		el: "#form-view #styling-tab",
		events: {
			"change [name='line-type']": "onLineTypeChange",
			"change [name^='margin-']": "onMarginChange",
			"change [name='unit']": "onUnitChange"
		},

		initialize: function( options ) {
			
			this.dispatcher = options.dispatcher;
			
			this.$lineTypeRadios = this.$el.find( "[name='line-type']" );
			//margins
			this.$marginTop = this.$el.find( "[name='margin-top']" );
			this.$marginLeft = this.$el.find( "[name='margin-left']" );
			this.$marginRight = this.$el.find( "[name='margin-right']" );
			this.$marginBottom = this.$el.find( "[name='margin-bottom']" );
			//unit
			this.$unit = this.$el.find( "[name='unit']" );
			
			this.render();

		},

		render: function() {

			var lineType = App.ChartModel.get( "line-type" );
			this.$lineTypeRadios.filter( "[value='" + lineType + "']" ).prop( "checked", true );

			var margins = App.ChartModel.get( "margins" );
			this.$marginTop.val( margins.top );
			this.$marginLeft.val( margins.left );
			this.$marginRight.val( margins.right );
			this.$marginBottom.val( margins.bottom );

			this.$unit.val( App.ChartModel.get( "unit" ) );

		},

		onLineTypeChange: function( evt ) {

			var $radio = $( evt.currentTarget );
			App.ChartModel.set( "line-type", $radio.val() );

		},

		onMarginChange: function( evt ) {

			var $control = $( evt.currentTarget ),
				controlName = $control.attr( "name" ),
				marginsObj = { top: this.$marginTop.val(), 
							left: this.$marginLeft.val(), 
							right: this.$marginRight.val(), 
							bottom: this.$marginBottom.val() };

			App.ChartModel.set( "margins", marginsObj );
			App.ChartModel.trigger( "update" );

		},

		onUnitChange: function( evt ) {
			var $control = $( evt.currentTarget );
			App.ChartModel.set( "unit", $control.val() );
		}


	});

})();