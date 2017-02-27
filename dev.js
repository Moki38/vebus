//var vebus_buffer   = Buffer.from([0x04, 0xFF, 0x41, 0x01, 0x00]);
//var vebus_buffer   = Buffer.from([0x05, 0xFF, 'W', 0x30, 0x0D, 0x00],'hex');

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

function frame(command, data) {

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
  console.log(w_buffer);
  
}
// Instruct the MK2 to communicate with the VE.Bus device at address 0
frame('A',[0x01,0x00]);

// Read the software version of the target
frame('W',[0x05,0x00,0x00]);
frame('W',[0x06,0x00,0x00]);

// Request the scale and offset information of the DC voltage
frame('W',[0x36,0x04,0x00]);

// Request the State of Charge value
frame('W',[0x30,0x0D,0x00]);

// Request the DC info frame
frame('F',[0x00]);

// Request the LED status
frame('L');

// Instruct the MK2 to act as a remote panel - switch on, input current limit 8A (of 16A max.) using variant 1 (sending potvalue and scale)
frame('S',[0x03,0x80,0x10,0x01,0x01]);

// Send single remote panel command - switch on, input current limit 31.5A using variant 2 (sending absolute current limit)
frame('S',[0x03,0x3B,0x01,0x01,0x80]);

// Instruct the MK2 to append LED status to all frames
frame('S',[0x00,0x00,0x00,0x01,0x02]);

