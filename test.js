var term = require( 'terminal-kit' ).terminal;
var vebus = require( './index.js' );

//
// VE.Bus
//
var vebus_data = {};
vebus.open('/dev/ttyVEB');

function terminate()
{
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
}

term.clear();

function vebus_display() {
     term.moveTo( 24 , 2 , "VE-Bus MK2") ;
     term.moveTo( 0 , 0 , "") ;
}


var displayinterval = setInterval(function () {
    vebus_data = vebus.update();
    vebus_display();
  }, 500);

term.on( 'key' , function( name , matches , data ) {
    term.moveTo( 1 , 15 , "Keyboard event %s, %s.\n" , name , data ) ;
//    console.log( "'key' event:" , name ) ;
    if ( matches.indexOf( 'CTRL_C' ) >= 0 ) {
      term.green( 'CTRL-C received...\n' ) ;
      terminate() ;
    }
} ) ;


