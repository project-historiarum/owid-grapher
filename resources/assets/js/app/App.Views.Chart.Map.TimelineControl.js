;(function() {
	"use strict";
	owid.namespace("App.Views.Chart.Map.TimelineControl");
	
	App.Views.Chart.Map.TimelineControl = Backbone.View.extend({

		el: "#map-chart-tab .map-timeline-controls .timeline-control",
		events: {
			"input [type='range']": "onTargetYearInput",
			"change [type='range']": "onTargetYearInput",
		},

		initialize: function( options ) {
			
			this.dispatcher = options.dispatcher;
			
			var mapConfig = App.ChartModel.get( "map-config" );
			
			this.$win = $( window );
			this.$sliderWrapper = this.$el.find( ".timeline-wrapper" );
			this.$slider = this.$el.find( ".timeline-slider" );
			this.$sliderLabel = this.$slider.find( ".timeline-slider-label" );
			this.$sliderInput = this.$sliderWrapper.find( "[type='range']" );

			this.$startYear = this.$el.find( ".timeline-start-year" );
			this.$endYear = this.$el.find( ".timeline-end-year" );

			this.dispatcher.on( "increment-time", this.onIncrementTime, this );

			//this.$win.on( "resize", $.proxy( this.onResize, this ) );

			//year slider
			/*  App.ChartModel.on( "change", this.onChartModelChange, this );
				App.ChartModel.on( "change-map", this.onChartModelChange, this );*/

		},

		render: function() {
			var mapConfig = App.ChartModel.get( "map-config" );
			
			this.years = owid.timeRangesToYears(mapConfig.timeRanges, mapConfig.minYear, mapConfig.maxYear);
			this.minYear = this.years[0];
			this.maxYear = this.years[this.years.length-1];
			this.targetYear = mapConfig.targetYear;

			this.$startYear.text(owid.displayYear(this.minYear));
			this.$endYear.text(owid.displayYear(this.maxYear));

			if (owid.displayYear(this.minYear).length > 4) 
				this.$startYear.css('font-size', '10px');
			else
				this.$startYear.css('font-size', "");

			if (owid.displayYear(this.maxYear).length > 4) 
				this.$endYear.css('font-size', '10px');
			else
				this.$endYear.css('font-size', "");
			
			this.$sliderInput.attr( "min", this.minYear );
			this.$sliderInput.attr( "max", this.maxYear );
			//this.$sliderInput.attr( "step", mapConfig.timeInterval ); // had to disable this because wouldn't allow to chose starting and ending year outside of steo
			
			this.updateSliderInput( this.targetYear );
			
			if (this.minYear == this.maxYear) {
				this.$sliderInput.attr( "disabled", true );
			} else {
				this.$sliderInput.attr( "disabled", false );
			}

			this.createTicks( this.$sliderInput );
		},

		updateSliderInput: function( time ) {
			var intTime = parseInt( time, 10 ),
				min = parseInt( this.$sliderInput.attr( "min" ), 10 ),
				max = parseInt( this.$sliderInput.attr( "max" ), 10 ),
				newPoint = ( intTime - min ) / ( max - min );
			
			this.$sliderLabel.text(owid.displayYear(time));
			this.$slider.css( "left", this.$sliderWrapper.width()*newPoint );
			this.$sliderInput.val( intTime );
			if( intTime === min || intTime === max ) {
				this.$sliderLabel.hide();
				this.$sliderInput.removeClass( "thumb-label" );
				if( intTime === min ) {
					this.$startYear.addClass( "highlight" );
					this.$endYear.removeClass( "highlight" );
				} else {
					this.$startYear.removeClass( "highlight" );
					this.$endYear.addClass( "highlight" );
				}
			} else {
				this.$sliderLabel.show();
				this.$sliderInput.addClass( "thumb-label" );
				this.$startYear.removeClass( "highlight" );
				this.$endYear.removeClass( "highlight" );
			}
		},

		onChartModelChange: function( evt ) {
			this.render();
		},

		onTargetYearInput: function( evt ) {
			var $this = $( evt.target ),
				targetYear = parseInt($this.val());

			// Since we may have arbitrary year ranges with no consistent "step", we must instead
			// set the slider to step 1 and then lock to the nearest actual year on input
			var closestYear = _.min(this.years, function(year) {
				return Math.abs(year-targetYear);
			});

			this.updateSliderInput(closestYear);
		
			if (closestYear != targetYear) {
				this.$sliderInput.trigger("change");
			}

			App.ChartModel.updateMapConfig("targetYear", closestYear, false, "change-map-year");
		},

		onIncrementTime: function( evt ) {
			var currentYear = parseInt(this.$sliderInput.val()),
				index = this.years.indexOf(currentYear);

			var nextIndex = index+1;
			if (nextIndex >= this.years.length) {
				this.dispatcher.trigger( "max-increment-time" );
				return;				
			}

			var nextYear = this.years[nextIndex];
			
			this.$sliderInput.val(this.years[nextIndex]);
			this.$sliderInput.trigger("change");
		},

		createTicks: function( $input ) {
			if( this.$el.find( ".timeline-ticks" ).length ) {
				//this.$el.find(".timeline-ticks").remove();
				//already has ticks, bail
				return;
			}

			var min = this.minYear,
				max = this.maxYear,
				rangeSize = max-min,
				htmlString = "<ol class='timeline-ticks'>";	

			_.each(this.years, function(year, i) {
				var progress = (year-min) / rangeSize,
					percent = progress*100,
					translate = "translate(-" + percent + "%, 0)",
					tickString = "<li style='left:" + percent + "%;-webkit-transform:" + translate + ";-ms-transform:" + translate + ";transform:" + translate + "'>" + year + "</li>";
				htmlString += tickString;
			});

			htmlString += "</ol>";
			$input.after( $( htmlString ) );
		},

		show: function() {
			this.$el.css( "display", "block" );
		},

		hide: function() {
			this.$el.css( "display", "none" );
		}

	});
})();