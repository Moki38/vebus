var serialport = require('serialport');

var vebus_data = {};

exports.open = function(device) {
var port =  new serialport.SerialPort(device, {
                        baudrate: 2400,
			dataBits: 8,
			parity: 'none',
			stopBits: 1,
			flowControl: false
                        parser: serialport.parsers.raw)});
}

function checksum(chkdata) {
  var cs = 0;
  for (b = 0; b < chkdata.length; b++) {
//    console.log(parseInt(('00' + chkdata[b].toString(16)).substr(-2),16));
    cs = (cs - chkdata[b])%256;
  }
  if (cs < 0) {
    return (cs + 256);
  } else {
    return (cs);
  }
}

exports.frame = function(command, data) {

//  console.log(command);
//  console.log(data);
//  console.log(data.length);

  if (!data) {
    var w_buffer = new Buffer(4);
    w_buffer[0] = 2;
    w_buffer[1] = 255;
    w_buffer[2] = command.charCodeAt();
  } else {
    var w_buffer = new Buffer(data.length+4);

    w_buffer[0] = data.length+2;
    w_buffer[1] = 255;
    w_buffer[2] = command.charCodeAt();

    for (b = 0; b < data.length; b++) {
      w_buffer[b+3] = data[b];
    }
  }

  w_buffer[w_buffer.length-1] = parseInt(('00' + checksum(w_buffer).toString(16)).substr(-2),16)

  port.write(w_buffer);

}

function parse_vebus(data) {
  vebus.raw = data;
};


port.on('data', function(data) {
  parse_vebus(data);
});

port.on('open', () => {
  console.log('Port Opened');
});

port.on('data', (data) => {
  /* get a buffer of data from the serial port */
  console.log(data.toString());
});

exports.update = function() {
  return vebus_data;
}

exports.close = function() {
}

