const {Visitor} = alias.require('@models');

module.exports = async function(args){

    let {visitorId, locationUrl} = args;

    if (!visitorId){
        throw new Error("Cannot add ID image to visitor. No visitor ID specified.")
    }

    if (!locationUrl){
        throw new Error('Cannot add ID image to visitor. No location URL specified.');
    }

    const visitor = await Visitor.findOne({
        where: {
            id: visitorId
        }
    });

    if (!visitor){
        throw new Error('Cannot add ID image to visitor. This is not a valid visitor ID.');
    }

    visitor.idImage = locationUrl;

    await visitor.save();

    return true;

}
