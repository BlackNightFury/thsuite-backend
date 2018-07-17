
const thermalPrinter = require('node-thermal-printer');

thermalPrinter.init({
    type: 'epson'
});


thermalPrinter.println("Hello World");
thermalPrinter.newLine();
thermalPrinter.drawLine();
thermalPrinter.newLine();
thermalPrinter.cut();

let buffer = thermalPrinter.getBuffer();


console.log(buffer);
