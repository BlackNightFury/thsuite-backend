module.exports = async function(data){

    console.log("scaleData got data");
    console.log(data);

    this.broadcast.emit('scaleData', data);

}
