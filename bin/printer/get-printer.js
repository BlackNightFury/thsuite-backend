
const printer = require('printer');


console.log(printer.getPrinters());


let selectedPrinter = printer.getPrinters().find(printer => printer.name == 'POS-80');

console.log(selectedPrinter);

if(!selectedPrinter) {
    console.log("Could not find printer");
    process.exit();
}


