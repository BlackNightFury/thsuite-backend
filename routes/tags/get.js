const { Tag } = alias.require('@models');


module.exports = async function(tagId) {

    let tag = await Tag.findOne({
        where: {
            id: tagId
        }
    });

    return tag.get({plain: true})
};
