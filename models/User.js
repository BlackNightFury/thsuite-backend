'use strict';

const crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        clientId: {
            type: DataTypes.UUID
        },
        storeId: {
            type: DataTypes.UUID
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        licenseNumber: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },

        password: {
            type: DataTypes.STRING
        },
        pin: {
            type: DataTypes.STRING
        },
        posPin: {
            type: DataTypes.STRING
        },
        dob: {
            type: DataTypes.DATEONLY   //DATE
        },
        gender: {
            type: DataTypes.ENUM,
            values: ['male', 'female', 'other']
        },
        badgeId: {
            type: DataTypes.STRING
        },
        badgeExpiration: {
            type: DataTypes.DATEONLY   //DATE
        },
        stateId: {
            type: DataTypes.STRING
        },
        stateIdExpiration: {
            type: DataTypes.DATEONLY   //DATE
        },

        type: {
            type: DataTypes.ENUM,
            values: ['admin', 'pos']
        },
        status: {
            type: DataTypes.INTEGER
        },
        activation: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        isAPIUser: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'users',
        classMethods: {
            hash : function (password){
                const algo = 'sha1';
                const salt = 'DYhG93b0qyJfIxfs32guVoUubWwvniR2G0FgaC9mi';
                const digest = 'hex';

                return crypto.createHash(algo).update(salt+password).digest(digest);

            },
            check : function (password, hash){

                const passHash = this.hash(password);

                return (hash === passHash);

            },

            associate: function(db) {
                this.belongsTo(db.Store, {
                    foreignKey: 'storeId'
                });
                this.hasOne(db.Permission, {
                    foreignKey: 'userId'
                });
                this.hasOne(db.EmailSettings, {
                    foreignKey: 'userId'
                });
                this.hasMany(db.TimeClock, {
                    foreignKey: 'userId'
                });
            },

            generateActivationCode: function(){

                let length = 32;

                let characters = '0123456789abcdefghijklmnopqrstuvwxyz';

                let actCode = '';

                for(let i =0; i < length; i++){

                    actCode += characters.substr(Math.floor(Math.random() * characters.length+1) ,1);

                }

                return actCode;

            }
        },
        instanceMethods: {
            sendTemporaryPasswordEmail : function(){

                function emailView(password){
                    let html = Promise.fromCallback(callback => {
                        let ejs = require('ejs');
                        return ejs.renderFile(__dirname + '/../view/emails/new_user.ejs', {
                            "data": {
                                message: "Lets create a new password",
                                password: password
                            },
                        }, callback);
                    });
                    return html;
                }

               // TODO Sendgrid NPM API key send email here
               //  const helper = require('sendgrid').mail;
               //  let fromEmail = new helper.Email('noreply@thsuite.com');
               //  let toEmail = new helper.Email(user.email);
               //  let subject = 'Create THSuite Password';

                const algo = 'sha1';
                const salt = 'DYhG93b0qyJfIxfs32guVoUubWwvniR2G0FgaC9mi';
                const digest = 'hex';
                var moment = require('moment');
                const now = moment().format();
                const password =  crypto.createHash(algo).update(salt+now).digest(digest);
                this.password = password;
                this.save();

                (async ()=>{
                    try{
                        let html = await emailView(password);
                        var fs = require('fs');
                        fs.writeFile('newPassword.html', html, function(err) {
                            if (err) console.log(err);
                            console.log("saved password file");
                        });
                    }catch(e){
                        console.log(e)
                    }
                })();
                
                // let content = new helper.Content('text/html', html);
                // let content = new helper.Content('text/plain', "heres your new password");
                // let mail = new helper.Mail(fromEmail, subject, toEmail, content);
                // let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
                // let request = sg.emptyRequest({
                //     method: 'POST',
                //     path: '/v3/mail/send',
                //     body: mail.toJSON()
                // });
                // sg.API(request, function (error, response) {
                //     if (error) {
                //         console.log('Error response received');
                //     }
                //     console.log(response.statusCode);
                //     console.log(response.body);
                //     console.log(response.headers);
                // });
            },
        }
    });
};
