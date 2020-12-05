;(function(context) {

  'use strict';

  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  function App( localStorageKey ) {

    this.stores = new Stores(localStorageKey);
    this.currentId = 0;
    this.$insert = $('#js-insert');
    this.$toggleAll = $('#js-toggle-all');
        this.$choose = $('#choose');
    this.$bar = $('#js-bar');
    this.$list = $('#js-list');
    this.$clearCompleted = $('#js-clear-completed');
    this.$total = $('#js-total');
    this.$filters = $('#js-filters');
    this.addEventListeners();
    this.render();
        this.$selection = $('#selection');

  }

  App.fn = App.prototype;

  App.fn.addEventListeners = function() {

    $.on(this.$insert, 'keypress', this.onInsert.bind(this));

    $.on(this.$toggleAll, 'click', this.onToggleAll.bind(this));
        $.on(this.$choose, 'click', this.selectRandom.bind(this));
    $.delegate(this.$list, '.toggle', 'click', this.onToggle.bind(this));

    $.delegate(this.$list, '.destroy', 'click', this.onDestroy.bind(this) );

    $.on(this.$clearCompleted, 'click', this.onClearCompleted.bind(this));


    $.delegate(this.$filters, '.button', 'click', this.onFilter.bind(this));

    $.delegate(this.$list, 'span', 'dblclick', this.onStartEditing.bind(this));
    $.delegate(this.$list, '.edit', 'keyup', this.onEditingCancel.bind(this));
    $.delegate(this.$list, '.edit', 'keypress', this.onEditingDone.bind(this));
    $.delegate(this.$list, '.edit', 'blur', this.onEditingLeave.bind(this) );
  };

  App.fn.onStartEditing = function(event) {
    var li = $.parent(event.target, 'li');
    var element = $('.edit', li);
    this.currentId = parseInt(li.dataset.id, 10);
    li.className += ' editing';
    element.value = event.target.innerHTML;
    element.focus();
  };

  App.fn.onEditingCancel = function(event) {
    if( event.keyCode === ESC_KEY ) {
      console.log('onEditingCancel', event.target);
      event.target.dataset.isCanceled = true;
      event.target.blur();
    }
  };

  App.fn.onEditingDone = function(event) {
    if( event.keyCode === ENTER_KEY ) {
      event.target.blur();
    }
  };

  App.fn.onEditingLeave = function(event) {
    console.log('onEditingLeave');
    var input = event.target;
    var id = this.getItemId( input );
    var text = input.value.trim();
    var li = this.getElementByDataId( id );
    if( input.value.trim() ) {
      var item = {
        id: id,
        text: text
      };
      this.stores.save(item,this.endEditing.bind(this, li, text));
    } else {
      if( input.dataset.isCanceled ) {
        this.endEditing( li );
      } else {
        this.destroy( id );
      }
    }
  };

  App.fn.endEditing = function( li, text ) {
    li.className = li.className.replace('editing', '');
    $('.edit', li).removeAttribute('data-is-canceled');
    if( text ) {
      $('span', li).innerHTML = text;
    }
  };

  App.fn.getItemId = function( element ) {
    var li = $.parent(element, 'li');
    return parseInt(li.dataset.id, 10);
  };

  App.fn.getElementByDataId = function( id ) {
    return $('[data-id="' + id + '"]');
  };

  App.fn.onInsert = function( event ) {
    var element = event.target;
    var text = element.value.trim();
    if( text && event.keyCode === ENTER_KEY ) {
      this.insert(text);
      element.value = '';
    }
  };

  App.fn.onToggleAll = function(event) {

  };

  App.fn.onToggle = function(event) {

  };

  App.fn.onDestroy = function(event) {
    var id = this.getItemId( event.target );
    this.destroy( id );
  };

  App.fn.onClearCompleted = function(event) {

  };

  App.fn.onFilter = function(event) {

  };

  // Insert
  App.fn.insert = function( text ) {
    var item = {
      text: text,
      completed: false
    };
    this.stores.save(item, function( item ) {
      var element = this.nodeItem( item );
      this.$list.appendChild( element );
      this.showControls();
    }.bind(this));
  };

  // Destroy
  App.fn.destroy = function( id ) {
    this.stores.destroy( id, function() {
      var li = this.getElementByDataId( id );
      this.$list.removeChild(li);
      this.showControls();
    }.bind(this));
  };

  App.fn.filter = function() {

  };

  // Render
  App.fn.render = function() {

    var filter = this.filter();

    this.stores.findAll(function(items){
      if( filter ) {
        items = items
          .filter(function(item) {
            return item.completed === ( filter === 'completed' );
          });
      }
      var nodes = this.nodeItemMulti( items );
      this.$list.innerHTML = "";
      this.$list.appendChild(nodes);
      this.showControls();

    }.bind(this));

  };


  App.fn.showControls = function () {
    this.stores.findAll(function(items){
      this.showBarAndToggleAll( items );
      this.showTotalTasksLeft( items );
      this.showClearCompleted( items );
    }.bind(this));
  };

  App.fn.showBarAndToggleAll = function( items ) {

  };

  App.fn.showTotalTasksLeft = function(items) {

  };

  App.fn.showClearCompleted = function(items) {
    var some = items
      .some(function( item ) {
        return item.completed;
      });
    this.$clearCompleted.style.display = some ? 'inline-block' : 'none';
  };

  App.fn.nodeItemMulti = function ( items ) {
    var fragment = document.createDocumentFragment();
    $.each( items, function( item ) {
      fragment.appendChild( this.nodeItem(item) );
    }.bind(this));
    return fragment;
  };

  App.fn.nodeItem = function( item ) {
    var li = document.createElement('li');
    var div = document.createElement('div');

    var span = document.createElement('span');
    var destroy = document.createElement('button');
    var edit = document.createElement('input');

    li.setAttribute('data-id', item.id );

    if ( item.completed ) {
      li.className = 'completed';
    }

    div.className = 'todo';


    span.appendChild( document.createTextNode(item.text) );

    destroy.className = 'destroy';
    // destroy.appendChild( document.createTextNode('X') );

    edit.setAttribute('type', 'text');
    edit.className = 'edit';



    div.appendChild(span);
    div.appendChild(destroy);

    li.appendChild(div);
    li.appendChild(edit);

    return li;
  }

  App.fn.selectRandom = function() {
        var max = this.$list.children.length;



        for (var child of this.$list.children) {
                child.style.backgroundColor = '';
        }




        this.$list.children[Math.floor(Math.random() * max)].style.backgroundColor = 'Green';
  }

  // Initialization on Dom Ready
  window.addEventListener('DOMContentLoaded', function() {
    var app = new App('todo');
  });

})(this);
