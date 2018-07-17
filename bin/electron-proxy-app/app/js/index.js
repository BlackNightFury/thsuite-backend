const {ipcRenderer} = require('electron');
const log = require('electron-log');


console.log = log.warn;

let runProxy = function(){
    console.log("Sending message");
    ipcRenderer.send('restart-proxy');
};

let $status = $('#connection-status');

let activeTemplate = '<div class="circle on small"></div>';
let inActiveTemplate = '<div class="circle off small"></div>';

ipcRenderer.on('proxy-connected', (event, arg) => {
    console.log("Proxy has connected");
    $status.removeClass('off');
    $status.addClass('on');
});

ipcRenderer.on('proxy-disconnected', (event, arg) => {
    console.log("Proxy has disconnected");
    $status.removeClass('on');
    $status.addClass('off');
});

// let testLabelButton = '<button';
// let testReceiptButton = '';

ipcRenderer.on('got-devices', (event, arg) => {
    console.log("Renderer got devices");
    console.log(arg);
    let type = arg.type;
    let devices = arg.devices;
    //Clear table
    $('#' + type + ' tbody tr').remove();
    if(devices.length){
        devices.forEach(device => {
            //Add row to table
            if(type == 'printer'){
                $('#' + type +' > tbody:last-child').append(`
                                        <tr>
                                            <td>${device.name}</td>
                                            <td>${device.portName}</td>
                                            <td>${device.attributes.indexOf('OFFLINE') === -1 ? activeTemplate : inActiveTemplate}</td>
                                            <td><button class="test-button" data-printer="${device.name}" data-type="label">Test Label</button></td>
                                            <td><button class="test-button" data-printer="${device.name}" data-type="receipt">Test Receipt</button></td>
                                        </tr>`);
            }else{
                $('#' + type +' > tbody:last-child').append(`<tr><td>${device.name}</td><td>${device.portName}</td><td>${device.status ? activeTemplate : inActiveTemplate}</td></tr>`);
            }
        });

        //Add test listeners

        $('.test-button').off('click');

        $('.test-button').on('click', function(){
            let type = $(this).data('type');
            let printerName = $(this).data('printer');

            ipcRenderer.send('print-test-'+type, printerName);

        });

    }

})

document.querySelector('#connect').addEventListener('click', function(){
    runProxy();
});
