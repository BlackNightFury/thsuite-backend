const {LabTestResult} = alias.require('@models');
module.exports = async function(packageId){

    let result = await LabTestResult.findOne({
        where: {
            packageId
        }
    });

    if(result){
        return result.id;
    }else{
        return null;
    }

}
