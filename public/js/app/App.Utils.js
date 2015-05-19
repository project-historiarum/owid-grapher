;( function() {

	"use strict";

	App.Utils = {};
	
	App.Utils.mapData = function( rawData, transposed ) {

		var data = [],
			dataById = [],
			countryIndex = 1;

		//do we have entities in rows and times in rows?	
		if( !transposed ) {
			//no, we have to switch rows and columns
			rawData = App.Utils.transpose( rawData );
		}
		
		//extract time column
		var timeArr = rawData.shift();
		//get rid of first item (label of time column) 
		timeArr.shift();
		
		for( var i = 0, len = rawData.length; i < len; i++ ) {

			var singleCol = rawData[ i ],
				colName = singleCol.shift();

			var singleData = _.map( singleCol, function( value, i ) {
				return { x: App.Utils.parseTimeString( timeArr[i] ), y: +value }
			} );

			//construct entity obj
			var	entityObj = {
				id: i,
				key: App.Utils.parseEntityString( colName ),
				values: singleData
			};

			data.push( entityObj );

		}

		return data;

	},

	App.Utils.mapSingleVariantData = function( rawData, variableName ) {

		var variable = {
			name: variableName,
			values: App.Utils.mapData( rawData )
		};
		return [variable];

	},	

	App.Utils.mapMultiVariantData = function( rawData, entityName ) {
		
		//transform multivariant into standard format ( time, entity )
		var variables = [],
			transposed = App.Utils.transpose( rawData ),
			timeArr = transposed.shift();

		//get rid of first item (label of time column) 
		timeArr.shift();
		
		_.each( transposed, function( values, key, list ) {

			//get variable name from first cell of columns
			var variableName = values.shift();
			//add entity name as first cell
			values.unshift( entityName );
			//construct array for mapping
			var dataToMap = [ timeArr, values ];
			//construct object
			var variable = {
				name: variableName,
				values: App.Utils.mapData( dataToMap, true )
			};
			variables.push( variable );

		} ); 

		return variables;

	},

	App.Utils.transpose = function( arr ) {
		var keys = _.keys( arr[0] );
		return _.map( keys, function (c) {
			return _.map( arr, function( r ) {
				return r[c];
			} );
		});
	},

	App.Utils.transform = function() {

		console.log( "app.utils.transform" );

	},

	App.Utils.parseTimeString = function( str ) {

		//here will be smart way of converting times string from varius format into actual time
		return +str;

	},

	App.Utils.parseEntityString = function( str ) {

		//here will be country name detection and stuff
		return str;

	}


})();