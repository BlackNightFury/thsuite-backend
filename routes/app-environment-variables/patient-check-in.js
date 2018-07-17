const {sequelize} = alias.require('@models');
module.exports = async function(){

    const query = `SELECT * FROM patient_check_in_environment_variables LIMIT 1`;

    let data = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        logging: console.log
    });

    let response = data[0];

    delete response.id;

    return response;

}
