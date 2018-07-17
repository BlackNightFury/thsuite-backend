const { Tag } = alias.require('@models');

module.exports = async function(tag) {

    let sameNameStoreTag = await Tag.find({where: { storeId: tag.storeId, value: tag.value }})
    if( sameNameStoreTag ) throw new Error('Tag with that name already exists')
    
    let existingTag = await Tag.find({
        where: {
            id: tag.id,
        }
    });

    if(!existingTag) {
        existingTag = Tag.build({});
    }

    let isNewRecord = existingTag.isNewRecord;

    existingTag.id = tag.id;
    existingTag.version = tag.version;
    existingTag.storeId = tag.storeId;
    existingTag.value = tag.value;

    await existingTag.save();

    if(isNewRecord) {
        this.broadcast.emit('create', existingTag.get());
    }
    else {
        this.broadcast.emit('update', existingTag.get());
    }

    return existingTag
};
