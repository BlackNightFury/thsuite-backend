module.exports = function (sequelize, DataTypes) {
    return sequelize.define('LabTestResult', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        packageId: {
            type: DataTypes.UUID,
        },
        thc: {
            type: DataTypes.DECIMAL(8,3)
        },
        thcA: {
            type: DataTypes.DECIMAL(8,3)
        },
        cbd: {
            type: DataTypes.DECIMAL(8,3)
        },
        cbdA: {
            type: DataTypes.DECIMAL(8,3)
        },
        cbg: {
            type: DataTypes.DECIMAL(8,3)
        },
        cbn: {
            type: DataTypes.DECIMAL(8,3)
        },
        cbgA: {
            type: DataTypes.DECIMAL(8,3)
        },
        potencyUnits: {
            type: DataTypes.ENUM,
            values: ['%', 'mg/ml']
        },
        aPinene: {
            type: DataTypes.DECIMAL(8,3)
        },
        bPinene: {
            type: DataTypes.DECIMAL(8,3)
        },
        bMyrcene: {
            type: DataTypes.DECIMAL(8,3)
        },
        limonene: {
            type: DataTypes.DECIMAL(8,3)
        },
        terpinolene: {
            type: DataTypes.DECIMAL(8,3)
        },
        ocimene: {
            type: DataTypes.DECIMAL(8,3)
        },
        linalool: {
            type: DataTypes.DECIMAL(8,3)
        },
        bCaryophyllene: {
            type: DataTypes.DECIMAL(8,3)
        },
        humulene: {
            type: DataTypes.DECIMAL(8,3)
        },
        bEudesmol: {
            type: DataTypes.DECIMAL(8,3)
        },
        caryophylleneOxide: {
            type: DataTypes.DECIMAL(8,3)
        },
        nerolidol: {
            type: DataTypes.DECIMAL(8,3)
        },

    }, {
        tableName: 'lab_test_results',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Package, {
                    foreignKey: 'packageId'
                });
            }
        }
    });
};

