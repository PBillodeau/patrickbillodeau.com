;(function(context) {

  'use strict';

  var store = localStorage;

  function Stores( key ) {
    this.key = key;
    if( !store[key] ) {
      store[key] = JSON.stringify([
                {"text": "Vinyl Taco", "complete": false, "id": 1},
                {"text": "Noodles and Co.", "completed": false, "id": 2},
                {"text": "Smiling Moose", "completed": false, "id": 3},
                {"text": "Mexican Village", "completed": false, "id": 4},
                {"text": "Wasabi", "completed": false, "id": 5},
                {"text": "Kobe's", "completed": false, "id": 6},
                {"text": "Aladin's", "completed": false, "id": 7},
                {"text": "Applebees", "completed": false, "id": 8},
                {"text": "Wurst", "completed": false, "id": 9},
                {"text": "NoBull", "completed": false, "id": 10},
                {"text": "Porter Creek", "completed": false, "id": 11},
                {"text": "Toasted Frog", "completed": false, "id": 12},
                {"text": "Paradiso", "completed": false, "id": 13},
                {"text": "Pancheros", "completed": false, "id": 14},
                {"text": "Texas Roadhouse", "completed": false, "id": 15},
                {"text": "Sickies", "completed": false, "id": 16},
                {"text": "Lucky 13", "completed": false, "id": 17},
                {"text": "Johnny Carinos", "completed": false, "id": 18},
                {"text": "Longhorn Steakhouse", "completed": false, "id": 19},
                {"text": "Panera", "completed": false, "id": 20},
                {"text": "Mezza Luna", "completed": false, "id": 21},
                {"text": "HuHot", "completed": false, "id": 22},
                {"text": "Olive Garden", "completed": false, "id": 23},
                {"text": "Famous Dave's", "completed": false, "id": 24},
                {"text": "Ruby Tuesday", "completed": false, "id": 25},
                {"text": "Space Aliens", "completed": false, "id": 26},
                {"text": "Blaze Pizza", "completed": false, "id": 27},
                {"text": "Jade Dragon", "completed": false, "id": 28},
                {"text": "Mall Food Court", "completed": false, "id": 29},
                {"text": "Buffalo Wild Wings", "completed": false, "id": 30},
                {"text": "IHOP", "completed": false, "id": 31},
                {"text": "Denny's", "completed": false, "id": 32},
                {"text": "King House Buffet", "completed": false, "id": 33},
                {"text": "Chick-fil-A   ", "completed": false, "id": 34}
          ]);
    }
  }

  Stores.fn = Stores.prototype;

  Stores.fn.find = function( id, cb ) {

    var items = JSON.parse(store[this.key]);
    var item = items
      .filter(function(item) {
        return id === item.id;
      });
    cb.call(this, item[0] || {} );
  };

  Stores.fn.findAll = function( cb ) {
    cb.call(this, JSON.parse( store[this.key] ));
  };

  Stores.fn.save = function( item, cb, options ) {

    var items = JSON.parse(store[this.key]);

    // Implementar Update Multiple
    // if ( options && options.multi ) {
    // }

    // Update
    if (item.id) {
      items = items
        .map(function( x ) {
          if( x.id === item.id ) {
            for (var prop in item ) {
              x[prop] = item[prop];
            }
          }
          return x;
        });
    // Insert
    } else {
      item.id = new Date().getTime();
      items.push(item);
    }

    store[this.key] = JSON.stringify(items);

    cb.call(this, item);
    // this.findAll(cb);

  };

  Stores.fn.destroy = function( id, cb ) {

    var items = JSON.parse(store[this.key]);
    items = items
        .filter(function( x ) {
          return x.id !== id;
        });

    store[this.key] = JSON.stringify(items);

    cb.call(this, true);

  };


  Stores.fn.drop = function( cb ) {
    store[this.key] = JSON.stringify([]);
    this.findAll(cb);
  };

  context.Stores = Stores;

})( this );
