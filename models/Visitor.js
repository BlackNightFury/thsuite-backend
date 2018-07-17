module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Visitor', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        idImage: {
            type: DataTypes.STRING
        },
        signature: {
            type: DataTypes.STRING
        },
        visitReason: {
            type: DataTypes.STRING
        },
        clockIn: {
            type: DataTypes.DATE
        },
        clockOut: {
            type: DataTypes.DATE
        },
        autoClockedOut: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'visitors'
    });
};
