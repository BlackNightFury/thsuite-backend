"use strict";

const allConfigs = {

    all: {

        sequelize: {
            logging: false,
            define: {
                paranoid: true
            }
        },

        etc: {
            s3: {
                key: 'AKIAIIUOPFRVAHD45DZQ',
                secret: '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',
                bucket: 'thsuite'
            }
        },

        sendGrid: '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',

        environment: {
            resendMetrcReceipts: false,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: true,
        },


        JWT_SECRET: 'V7aj@EqXTCquxdNyZbt6P%H@CBwZY3*J',
        METRC_CONVERTED_PACKAGE_ID: '-1',
        METRC_CONVERTED_PACKAGE_ID_IN_PROGRESS: '-2',
        METRC_CONVERTED_PACKAGE_ID_FAILED: '-3',

        envResolverPort: 9999,
        envResolverDomain: 'localhost',
    },

    development: {
        sequelize: {
            dialect: "mysql",
            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_karing_kind_staging"
        },

        express: {
            domain: 'localhost',
            apiDomain: 'localhost',
            clientPort: 4200,
            port: 3000
        },
        environment: {
            resendMetrcReceipts: true,
            autoClockOut: true,
            visitorAutoClockOut: true,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: true, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'random',
            companyName: "Colorado Grow Company",
            phone: "",
            logoImageLocation: "../../public/img/herbanlegendslogo.png",
            addressInformation: {
                name: "Herban Legends",
                address1: "101 East Chesapeake Avenue",
                address2: "Towson, MD 21286",
                address3: "D-18-00025"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "All sales are final",
                    "NEWLINE",
                    "Faulty vape cartridges exchanged only with original",
                    "packaging and receipt, within 14 days of sale",
                    "NEWLINE"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            overdrawnEmails: [
                'joe@vimbly.com',
                'simon@vimbly.com'
            ],
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'recreational',
            barcodeLabelWidth: 2, //In inches,
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,1540,1540,14,Q07IFE,P03KFE,O01MFC,O0OF8,N07PF,M01QFE,M07RF8,L01JF8J07IFC,L03IF8L07IF,L0IFCN0IFC,K01FFEO03FFE,K07FF8P0IF,J017FEQ03FFC2,J01BFCR0FFE6,J03EFS07FEE,J07F8U03E,J0YFE,I01YFE,I03YFE,I07YFE8,I0gFEC,001gFEC,001gFEE,003FDXFEF,007F9XFEF8,007F1XFEF8,00FE1XFEFC,01FE1XFEFC,01FC1XFEFE,03FC1XFEFF,03F81CL01FF7M0E7F,07F018L01FFBM067F8,07F01M01FFDM023F8,0FEO01FFEN03FC,0FEO01IFN01FC,1FCO01IFN01FC,1FCO01IFO0FE,:3F8O01IFO07E,3F8O01IFO07F,3F801M01IFM0207F,7F0018L01IFM0603F,7F001CL01IFM0E03F87F001FL01IFL01E03F8FE001XFE03F8FE001XFE01F8::FE001XFE01FC:FC001XFE01FC:::FC001XFE00FC:FC001XFE01FC:FC001EO0FL01E01FCFC001CO07M0601FCFE0018O03O01FCFES01M0201F8FEI08L03001M0201F8FEI0CL03P0601F8FEI0EL038O0E01F87EI0FL03CN03E03F87FI0XFE03F,:3F001XFE03F,3F801XFE07F,3F801XFE07E,1F801XFE07E,1FC01XFE0FE,1FC01XFE0FC,0FE01XFE1FC,:0FE01XFE1F8,07F01XFE3F8,07F81XFE3F,03F81XFE7F,03FC1CFFU0EFE,01FC1BFFU06FE,01FE07FFU02FC,00FF0IFU02FC,007F0IFV0F8,007F9IFU04F,003FDIFU0FF,001KFT01FE,001KFT03FC,I0KFT07FC,I07JFT0FF8,I03JFS01FF,I01JFS03FE,J0JFS0FFC,J07IFR01FF8,J03IF8Q03FF,J01IF8Q0FFE,J01IF8P03FFC,J03IFCP0IF,J07IFEO03FFE,J0KFO0IFC,L01FFN0JF,L01JFCJ0JFE,M07RF8,M01QFE,N03PF8,O07NFC,P0MFE,P01LF,R07FFC,^FS',
                healthDisclaimer: '^FO105,290^A0R,17,17^FB500,11,0,L,0^FD The contents may be lawfully consumed only by the qualifying patient named on the attached label. It is illegal for any person to possess or consume the contents of the package other than the qualifying patient. It is illegal to transfer the package or contents to any person other than for a caregiver to transfer it to a qualifying patient. In the event of an emergency contact Maryland Poison Control at 1.800.222.1222. Keep the package and its contents away from children. ^FS',
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: true,
            requireAuthenticated: false,
        },
        JWT_SECRET: 't+4FB!h_C*$x9N=^XJqeLP6++tg$?t-n',
    },

    staging: {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_karing_kind_staging",
        },

        express: {
            domain: 'staging.thsuite.com',
            apiDomain: 'stagingapi.thsuite.com',
            clientPort: 80,
            port: 3001
        },
        environment: {
            resendMetrcReceipts: true,
            autoClockOut: true,
            visitorAutoClockOut: true,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'sequential',
            companyName: "Karing Kind LLC",
            phone: "",
            logoImageLocation: "../../public/img/karingkindlogo.png",
            addressInformation: {
                name: "Karing Kind LLC",
                address1: "5854 Rawhide Ct Suite C",
                address2: "Boulder, CO 80302",
                address3: "Phone: 303-449-WEED(9333)"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "404r-00040, 402r-00176, 403r-00232",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                    "NEWLINE",
                    "Find us on Facebook and Twitter",
                    "@karingkind for deals!"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'transactions',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation:{
                ZPLLogo: '',
                healthDisclaimer: '',
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: true,
            requireAuthenticated: false,
        }
    },

    "joe-staging": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "joe",
            password: "K9X9xG55KhLNzBX9",
            database: "thsuite_joe",
        },

        express: {
            domain: 'joe-staging.thsuite.com',
            apiDomain: 'joe-stagingapi.thsuite.com',
            clientPort: 80,
            port: 3002
        },
        environment: {
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'sequential',
            companyName: "THSuite LLC",
            phone: "",
            logoImageLocation: "../../public/img/karingkindlogo.png",
            addressInformation: {
                name: "Karing Kind LLC",
                address1: "5854 Rawhide Ct Suite C",
                address2: "Boulder, CO 80302",
                address3: "Phone: 303-449-WEED(9333)"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "404r-00040, 402r-00176, 403r-00232",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                    "NEWLINE",
                    "Find us on Facebook and Twitter",
                    "@karingkind for deals!"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'transactions',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '',
                healthDisclaimer: '',
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "dev-staging":{
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_dev",
        },

        express: {
            domain: 'dev-staging.thsuite.com',
            apiDomain: 'dev-stagingapi.thsuite.com',
            clientPort: 80,
            port: 3010
        },
        environment: {
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'sequential',
            companyName: "THSuite LLC",
            phone: "",
            logoImageLocation: "../../public/img/karingkindlogo.png",
            addressInformation: {
                name: "Karing Kind LLC",
                address1: "5854 Rawhide Ct Suite C",
                address2: "Boulder, CO 80302",
                address3: "Phone: 303-449-WEED(9333)"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "404r-00040, 402r-00176, 403r-00232",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                    "NEWLINE",
                    "Find us on Facebook and Twitter",
                    "@karingkind for deals!"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'transactions',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '',
                healthDisclaimer: '',
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "mike-staging": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_mike",
        },

        express: {
            domain: 'mike-staging.thsuite.com',
            apiDomain: 'mike-stagingapi.thsuite.com',
            clientPort: 80,
            port: 3008
        },
        environment: {
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'sequential',
            companyName: "THSuite LLC",
            phone: "",
            logoImageLocation: "",
            addressInformation: {
                name: "THSuite LLC",
                address1: "",
                address2: "",
                address3: ""
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "404r-00040, 402r-00176, 403r-00232",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                    "NEWLINE",
                    "Find us on Facebook and Twitter"
                ]
            },
            sendOverdrawnEmail: false,
            barcodeLabelWidth: 2, //In inches
            bulkFlowerInformation: {
                ZPLLogo: '',
                healthDisclaimer: '',
                format: 'MD'
            },
            requireAuthenticated: true,
        }
    },

    demo: {

        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite_demo",
            password: "QV5YNLu3X7EDFnnd",
            database: "thsuite_demo"
        },

        express: {
            domain: "demo.thsuite.com",
            apiDomain: 'demoapi.thsuite.com',
            port: 3006,
            clientPort: 80
        },
        environment: {
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: true, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: true,
            barcodeGenerationMode: 'random',
            companyName: "THSuite",
            phone: "",
            logoImageLocation: "../../public/img/thsuitelogo.png",
            addressInformation: {
                name: "THSuite",
                address1: "343 W. Erie St. Suite 200",
                address2: "Chicago, IL 60654"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                ]
            },
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'transactions',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '',
                healthDisclaimer: '',
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }

    },

    "metrc-ca-eval": {
        //For eval only
    },

    "metrc-co-eval": {
        //For eval only
    },

    "metrc-md-eval": {
        //For eval only
    },

    "metrc-or-eval": {
        //For eval only
    },

    "co-grow": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_co_grow"
        },

        express: {
            domain: 'co-grow.thsuite.com',
            apiDomain: 'co-grow-api.thsuite.com',
            clientPort: 80,
            port: 3004
        },
        environment: {
            autoAllocateEachBarcodes: true,
            autoClockOut: true,
            visitorAutoClockOut: true,
            receivedDateOnBarcodeLabels: true, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: true,
            barcodeGenerationMode: 'random',
            companyName: "Colorado Grow Company",
            phone: "",
            logoImageLocation: "../../public/img/cogrowcologo.png",
            addressInformation: {
                name: "Colorado Grow Company",
                address1: "965 1/2 Main Ave",
                address2: "Durango, CO 81301"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "All sales are final",
                    "NEWLINE",
                    "Faulty vape cartridges exchanged only with original",
                    "packaging and receipt, within 14 days of sale",
                    "NEWLINE"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            overdrawnEmails: [
                'simon@thsuite.com',
                'joe@thsuite.com',
                'rachellandreth970@gmail.com',
                'jason@thsuite.com'
            ],
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,1950,1950,15,,:R0E,Q03F8,Q031C,O01C20C,O03F00E,O063006,N046180C,N0C6180C,N0663198,N063F1F01,L01F31C004K06,L03318003CK07E,L0619801FCK07F8,L0618C07FCK07FF,L0618C3FFCK07FFC,K063304IFCK07IF,K031E01IFCK07IFC,K018007IFCK07IFE,K01C00JFCK07JF8,J070E03JFCK07JFC,J0F1C07JFCK07JFE,I019180KFCK07KF8,I033403KFCK07KFC,I03E607KFCK07KFE,I01CC0LFCK07KFE,J0F81LFCK07LF8,I0C303LFCK07LFC,003F003LFCK07LFE,0033807LFCK07LFE,002180JFBFFCK07MF,006181FEKFCK07MF8,007183FCFFC7FCK07MFC,003F03ECFFEFFCK07MFE,I0E07F0FFEFFCK07MFE,I070FFAFFAFFCK07NF,03E18FFCFF8FFCK07LF8F,03F09FFCFFCFFCK07KFE078,06101FFED9CFFCK07KFEF3C,06183FF83DE3FCK07KFCFBC,06183IFBEF1FCJ03LFDFBE,07307IF9D99FCI01MFCFFE,03E07FEF0D01FCI03MFE7FF,0080IF04501FCI0OF3FF,J0IF0C1B5FC003OF83F,0F80JF09C5FC00PFB9F81FC1FE7E1CF1FC01PFB9F830E1FFBCFE79FC01PFB9F83061FF97E751FC03PFC3FC2033FF4B8200FC07SFC2633FEEF6380FC0RF07C3663FEE6C9C2FC1JFC7KFE73C3E63FFE7C9807C1IFC00KFEFBE0CC7F303C4027C3IF8003JFEFBEI07FC18I033C3FFEI01JFEDBEI07FFBCI033C3FFCJ0JFE4BEFF07FBE80C003C7FFCJ07JF1FE1F07FDE006001C7FF8J03LFE0607FDD500600C7FFK03JF07!0307F03E9064007FFK03JFE7!I07F41E8CJ07FFK01KF7!3C07FF8E08J07FFK01!7E07FF6M07FFK01JF07!C207FF2FL07FFK01JF77!C307FF9M07FFK01JF73!C307FB8M07FFK01JF77!C207FE1AI031C7FFK03JF07!7E07FE3AC0033C7FFK03JFD!3C07F66701033C7FF8J03!I07F47EC5063C7FF8J07IFE07E07078001C6003C7FFCJ0JFE3FE0E07EF1987003C7FFEI01KF8FE3807FFDB820C3C3IFI03KF0FE7C07FFDBF2C87C3IFC007JFE3FE3F83DFD7E0C07C1IFE01LF3FE0783FFEFF8027C1IFC7MFCFC0E03FFEF0306FC0IFC7OFC3C03IFE0A48FC0IFC7LFC3FC3F81JFD88EFC07FFC7LF99FC07C1JFD99EFC03FF87LFBCF8I01JF919DFC01FF87LF3EF80060IFE3F3BFC00FF07LF3EF801F8JF5E1FFC007F07LFBCF,039CIFE60DFFC003F07KFE79F,060C7FFDB1EFFCI0E07KFC1FF,06067JFDEFFCI0207KFDCFE,06063JFDDFFCK07KFDCFE,06063JF9IFCK07KFDDFC,06001FFEE1IFCK07KFE1FC,03001IFC5IFCK07NF8,01I0IFCCIFCK07NF,001E0IF9E7FFCK07NF,003F07FE3JFCK07MFE,006103FF7F7FFCK07MFE,006183FF7JFCK07MFC,006181MFCK07MF8,006300MFCK07MF,003F007LFCK07MF,001C307LFCK07LFE,J0703LFCK07LFC,I01DC1LFCK07LF8,I038C0LFCK07LF,I030C07KFCK07KFE,J01F83KFCK07KFC,J03980KFCK07KF8,J061807JFCK07JFE,J041803JFCK07JFC,K07180JFCK07JF8,K0E3C07IFCK07IFE,K0C7F01IFCK07IFC,L06300IFCK07IF,L0C3003FFCK07FFC,K01C31807FCK07FF,K01E71C01FCK07F8,K033E06003CK07E,L01C77I04K06,N0DE7C,N0C67E,N0FCI6,N03C4263,O08C667,P08626,Q043C,Q0C38,R038,R03,R0F,R04,,^FS',
                healthDisclaimer: "^FO120,290^A0R,15,15^FB500,11,0,L,0^FD There may be health risks associated with the consumption of this product. This marijuana’s potency was tested with an allowable plus or minus 15% variance pursuant to 12-43.4-202(3)(a)(IV)(E), C.R.S. There may be additional health risks associated with the consumption of this product for women who are pregnant, breast feeding, or planning on becoming pregnant. Do not drive or operate heavy machinery while using marijuana. The marijuana contained within this package complies with the  mandatory contaminant testing required by rule R 1501. ^FS",
                format: 'CO'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "co-grow-staging": {

        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_co_grow_staging"
        },


        express: {
            domain: 'co-grow.thsuite.com',
            apiDomain:  '',
            clientPort: 80,
            port: 3004
        },
        environment: {
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: true, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: true,
            barcodeGenerationMode: 'random',
            companyName: "Colorado Grow Company",
            phone: "",
            logoImageLocation: "../../public/img/cogrowcologo.png",
            addressInformation: {
                name: "Colorado Grow Company",
                address1: "965 1/2 Main Ave",
                address2: "Durango, CO 81301"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: []
            },
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'transactions',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,1950,1950,15,,:R0E,Q03F8,Q031C,O01C20C,O03F00E,O063006,N046180C,N0C6180C,N0663198,N063F1F01,L01F31C004K06,L03318003CK07E,L0619801FCK07F8,L0618C07FCK07FF,L0618C3FFCK07FFC,K063304IFCK07IF,K031E01IFCK07IFC,K018007IFCK07IFE,K01C00JFCK07JF8,J070E03JFCK07JFC,J0F1C07JFCK07JFE,I019180KFCK07KF8,I033403KFCK07KFC,I03E607KFCK07KFE,I01CC0LFCK07KFE,J0F81LFCK07LF8,I0C303LFCK07LFC,003F003LFCK07LFE,0033807LFCK07LFE,002180JFBFFCK07MF,006181FEKFCK07MF8,007183FCFFC7FCK07MFC,003F03ECFFEFFCK07MFE,I0E07F0FFEFFCK07MFE,I070FFAFFAFFCK07NF,03E18FFCFF8FFCK07LF8F,03F09FFCFFCFFCK07KFE078,06101FFED9CFFCK07KFEF3C,06183FF83DE3FCK07KFCFBC,06183IFBEF1FCJ03LFDFBE,07307IF9D99FCI01MFCFFE,03E07FEF0D01FCI03MFE7FF,0080IF04501FCI0OF3FF,J0IF0C1B5FC003OF83F,0F80JF09C5FC00PFB9F81FC1FE7E1CF1FC01PFB9F830E1FFBCFE79FC01PFB9F83061FF97E751FC03PFC3FC2033FF4B8200FC07SFC2633FEEF6380FC0RF07C3663FEE6C9C2FC1JFC7KFE73C3E63FFE7C9807C1IFC00KFEFBE0CC7F303C4027C3IF8003JFEFBEI07FC18I033C3FFEI01JFEDBEI07FFBCI033C3FFCJ0JFE4BEFF07FBE80C003C7FFCJ07JF1FE1F07FDE006001C7FF8J03LFE0607FDD500600C7FFK03JF07!0307F03E9064007FFK03JFE7!I07F41E8CJ07FFK01KF7!3C07FF8E08J07FFK01!7E07FF6M07FFK01JF07!C207FF2FL07FFK01JF77!C307FF9M07FFK01JF73!C307FB8M07FFK01JF77!C207FE1AI031C7FFK03JF07!7E07FE3AC0033C7FFK03JFD!3C07F66701033C7FF8J03!I07F47EC5063C7FF8J07IFE07E07078001C6003C7FFCJ0JFE3FE0E07EF1987003C7FFEI01KF8FE3807FFDB820C3C3IFI03KF0FE7C07FFDBF2C87C3IFC007JFE3FE3F83DFD7E0C07C1IFE01LF3FE0783FFEFF8027C1IFC7MFCFC0E03FFEF0306FC0IFC7OFC3C03IFE0A48FC0IFC7LFC3FC3F81JFD88EFC07FFC7LF99FC07C1JFD99EFC03FF87LFBCF8I01JF919DFC01FF87LF3EF80060IFE3F3BFC00FF07LF3EF801F8JF5E1FFC007F07LFBCF,039CIFE60DFFC003F07KFE79F,060C7FFDB1EFFCI0E07KFC1FF,06067JFDEFFCI0207KFDCFE,06063JFDDFFCK07KFDCFE,06063JF9IFCK07KFDDFC,06001FFEE1IFCK07KFE1FC,03001IFC5IFCK07NF8,01I0IFCCIFCK07NF,001E0IF9E7FFCK07NF,003F07FE3JFCK07MFE,006103FF7F7FFCK07MFE,006183FF7JFCK07MFC,006181MFCK07MF8,006300MFCK07MF,003F007LFCK07MF,001C307LFCK07LFE,J0703LFCK07LFC,I01DC1LFCK07LF8,I038C0LFCK07LF,I030C07KFCK07KFE,J01F83KFCK07KFC,J03980KFCK07KF8,J061807JFCK07JFE,J041803JFCK07JFC,K07180JFCK07JF8,K0E3C07IFCK07IFE,K0C7F01IFCK07IFC,L06300IFCK07IF,L0C3003FFCK07FFC,K01C31807FCK07FF,K01E71C01FCK07F8,K033E06003CK07E,L01C77I04K06,N0DE7C,N0C67E,N0FCI6,N03C4263,O08C667,P08626,Q043C,Q0C38,R038,R03,R0F,R04,,^FS',
                healthDisclaimer: "^FO120,290^A0R,15,15^FB500,11,0,L,0^FD There may be health risks associated with the consumption of this product. This marijuana’s potency was tested with an allowable plus or minus 15% variance pursuant to 12-43.4-202(3)(a)(IV)(E), C.R.S. There may be additional health risks associated with the consumption of this product for women who are pregnant, breast feeding, or planning on becoming pregnant. Do not drive or operate heavy machinery while using marijuana. The marijuana contained within this package complies with the  mandatory contaminant testing required by rule R 1501. ^FS",
                format: 'CO'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "karing-kind": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_karing_kind",
        },

        express: {
            domain: 'karing-kind.thsuite.com',
            apiDomain: 'karing-kind-api.thsuite.com',
            clientPort: 80,
            port: 3003
        },
        environment: {
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'sequential',
            companyName: "Karing Kind LLC",
            phone: "",
            logoImageLocation: "../../public/img/karingkindlogo.png",
            addressInformation: {
                name: "Karing Kind LLC",
                address1: "5854 Rawhide Ct Suite C",
                address2: "Boulder, CO 80302",
                address3: "Phone: 303-449-WEED(9333)"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "404r-00040, 402r-00176, 403r-00232",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                    "NEWLINE",
                    "Find us on Facebook and Twitter",
                    "@karingkind for deals!"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,1430,1430,13,K01E,K03FE,K07IF,M07FF,N0FFE,N06FF8L02,N031FEL0C,N0387FL0C,M01FC0FK028,M0FFE02K098,L01FE3L01B,L07F018K033,K01F800CK066,K03EI06K04E,K078C003002015C005F8,K0F0F001J019801FF,J01C03C00805033807FC,J01800F00C0102703EF8,J03800FC060106F07DF,J03I0CF02058FE1F7E,J03I0C381078DC7FFC,J03001FF81048F0IF,J0300IF0086973FFC,J03006J086863FF,J01M0478CFFE,J01M063D9FF,K080FCI027BBFC,M07FF0027A7F,N07F80125F8,N061801238,N061801040FE8,M07F180107JFD,M0IF00107KFC,N01F00107LF8,O06I037FFEIFE,M0CK01JFEIF,M0FEJ07FFCBFE1FC,M07FFI0EFFE0FDBFF,N01FBC0AB7F81D7FE4,P0180AIFC01,M0FJ01EDBFE,M07F8001679FF,N07F80167CEF8,O0780166EF3E,N03F003E3E39D,N0FC002C363CF,M07FI02C370E7C,M0F8I028330FBE,M0FF8I083B879E,M01FF80283983CF,O0F80200D80DF8,R0201DC07BC,M01FL0D802FC,M03FCK04C003E,M071EI0604CI01,M0E07I07D0C,M0C03J0F04,M0C038K04,M0C618007816,M0F618007F,M07E18I07,K0181E18004,K03FEK078,K07IFI0102,M07FE0013,N0FFC00F8,N07FF81B,N031FE018,N0383F07,M01FC0F01C,M07FE0200F,L01FE3I038,L07E0180018,K01F800C007,K03E4006007C,K078FE020107,K0F07FF1I08,J01C003F880F8,J038K0403,J03807I06008,J03007F002,J03001FF81,J03J0F81,J03I01F80801,J03I0FC0087F,J01003FI0401,J01007CI0601,K0807FI0201,M01FF00208,O0F801,R01,M0F8I0178,M0FFC001,M0C7F8017,M0C03801,M04018,M06018001,M06018002,M0303,M03EFI078,M01FE,N07C,S048,,T08,,S04,,S07F,,^FS',
                healthDisclaimer: "^FO120,290^A0R,15,15^FB500,11,0,L,0^FD There may be health risks associated with the consumption of this product. This marijuana’s potency was tested with an allowable plus or minus 15% variance pursuant to 12-43.4-202(3)(a)(IV)(E), C.R.S. There may be additional health risks associated with the consumption of this product for women who are pregnant, breast feeding, or planning on becoming pregnant. Do not drive or operate heavy machinery while using marijuana. The marijuana contained within this package complies with the  mandatory contaminant testing required by rule R 1501. ^FS",
                format: 'CO'
            },
            rebalanceTransactionsBeforeExport: true,
            requireAuthenticated: false,
        }
    },

    "hi-tide": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_hi_tide"
        },

        express: {
            domain: 'hi-tide.thsuite.com',
            apiDomain: 'hi-tide-api.thsuite.com',
            clientPort: 80,
            port: 3005
        },
        environment: {
            metrcTransfersAreNotAvailable: true,
            autoClockOut: true,
            visitorAutoClockOut: true,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'random',
            companyName: "HI-TIDE Dispensary",
            phone: "(410) 701-2837",
            logoImageLocation: "../../public/img/hitidelogo.png",
            addressInformation: {
                name: "OC Botanicals LLC",
                address1: "12600 Marjan Lane",
                address2: "West Ocean City, MD, 21842",
                address3: "D-18-00013"
            },
            showPatientInfo: true,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all cannabis products",
                    // "404r-00040, 402r-00176, 403r-00232",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product.",
                    "Not for resale.",
                    "Keep out of reach of children",
                    // "NEWLINE",
                    // "Find us on Facebook and Twitter",
                    // "@karingkind for deals!"
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: true,
            barcodeLabelWidth: 1.15, //In inches
            realTimeTransactionReporting: true,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'medical',
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,1470,1470,15,,:::::M02FE,M03FE0F8S07C,04K03FE07ES07E,04L03E07CS01E,04M0E07ES07E,0401CJ0E0FES07E,0401CJ0E0FES0FE,0401CJ0E0FFR01FE,0401EJ0E0NF9EF841IE,0401F9E0FE0OFEFBE3CEE,0401FFE7FE0FDPFEF5E4,0401KFE0TF78,0401FFDF7E0RF7FF98,0401FF3FFE0VF8,0401EJ0E07FE7RF8,0401CJ0E0TF3FE,I01CJ0E0UFEE,J0CJ0E0VFE,3FCL0E0LFBOFE,204K07E0VFE,30CJ03FE0WF,1F8J03FE0FF8I01FF8,O0E0FFL0FE,Q0FEL01F,3FC08J060FEM07C,I014J0E0FEM03E,J0CJ0E0FEM01F,33C1CJ0A0FEM01F,2641DFEFFEP01F8,3CC1KFEP01FC,I01KFEQ0FC,:1FC1KFE0FEM01FC,1FC1EI01E0FEM01FC,0441CJ0E0FEM03FC,07C1CJ0E0FEM03FC,J0CJ060FFM0FFC,Q0FF8K07FFE,3FCN0KFBJF74,2641CJ0E0QFC,2241CJ0E0PFDC,I01CJ0E0QFC,I01EJ0E0QFC,3FC1KFE0QF8,01C1KFE07PF8,0F01KFE0QF,3FC1FDDCFE0PFE,I01F9007E0PFC,I01CJ0E0PF8,13C1CJ0E0OFE,2641CJ0E0OF8,3CC1CJ0E0IFE003E,1801CJ0E0FF,I01CJ0E0FE,3I0EJ0E0FE,1FC0EI01E0FE,0BC0F8003C0FEM01F8,3F807E01FC0FEM01F8,J07JFC0FEM01F8,J03JF80FEM01F8,3FC03JF00FEM01F8,3FC00IFE00FEM01F8001E,06C003FF800FF8L07BI0FFC,3FCN0OFC2001FFE,Q0NFE07001IF,L02J0NF3F4003IF,03C00FF1800NFEFC003IF,3F001FF7A00OF9F803IF8,07803IFB80QF803IF8,00407JF807MFE3E803IF8,J0KFC0OF3E003IF8,J0FC107E0QF003IF,0400F0100E0OFEJ07FF,0401E0100E0NFCJ013FF,0401C010060NFCJ017FE,0401C010060MF8L07FC,0401C010070FFCQ03F,0401C010060FF,0401C0100E0FE,0400C0103E0FE,0400E01FFE0FE,0400E01FFC0FE,0400701FF807E,04003C1FD8,04001C1F8,K041B,,:::::^FS',
                healthDisclaimer: "^FO105,290^A0R,17,17^FB500,11,0,L,0^FD The contents may be lawfully consumed only by the qualifying patient named on the attached label. It is illegal for any person to possess or consume the contents of the package other than the qualifying patient. It is illegal to transfer the package or contents to any person other than for a caregiver to transfer it to a qualifying patient. In the event of an emergency contact Maryland Poison Control at 1.800.222.1222. Keep the package and its contents away from children. ^FS",
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "other-place": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_other_place",

            allowSync: true
        },

        express: {
            domain: 'other-place.thsuite.com',
            apiDomain: 'other-place-api.thsuite.com',
            clientPort: 80,
            port: 3006 //TODO should be environment not config
        },
        environment: {
            autoAllocateEachBarcodes: true,
            autoClockOut: true,
            visitorAutoClockOut: true,
            receivedDateOnBarcodeLabels: true, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'random',
            companyName: "The Other Place",
            logoImageLocation: "../../public/img/otherplacelogo.png",
            addressInformation: {
                name: "The Other Place",
                address1: "466 West Main Street",
                address2: "Trinidad, CO 81082"
            },
            showPatientInfo: false,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all marijuana products",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product",
                    "to anyone under age 21. Not for resale.",
                    "Keep out of reach of children",
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: false,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: false,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'recreational',
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,2400,2400,15,,::::::::::::::::::::S0300C,Q01EJ018,Q0C003C0038,P0603JFE03,O0303LFE04,P03FEJ03FE,N021FC001C003F82,N087EI032I07E18,M011F8I022J0F84,N07CJ032J03E1,L010FK01CK078C,L023EK03EK03E,M078K063L0F1,K011EK01C0CK03C,K023CJ03F007CJ01E2,K047J01FE003F8J0F,K08EJ0FF8I0FFJ0388,J013CI03FFJ07FEI01C4,J0278I0FFEJ01FF8I0E,J04FI03FF8K0FFEI07,J08EI0IFL07FFI039,I011C001FFEL01FFC001C8,J038003FF8M0FFEI0E,I027I0IFN07FFI07,I04E001FFEN03FFC003,I01C003FF8O0FFE0039,I09C007FFI03FF8I07FF001C8,0013800FFEI03FFCI03FF800E,I07001FFCI04006J0FFC006,0026003FFJ04002J07FC007,I0E007FEJ04002J03FE003A,004C007FCJ04002J01FF0039,009C00FF8J04002K0FF801C,009801FFK060044J07F800C8,003801FEK03FFC4J01FC00C,013003FCK01FF84K0FE006,007007F8O04K07E006,026007F001FC4J04K03F007,02E00FCK04001C4K01F003,00E00FCK04001E4L0F8038,04C00F8K04I024L078038,01C01FL04I024L03C018,01C01E02J0440024L01C018,01803C1E001C47FFE4L01C01C,09803802J047FFE4M0E00C,0B80301EJ044002401K0600C80B00601E01FC4I024008J0200C80300600A01004I024008J0100E,1300401EJ04001E4418J01806,13008004J04J04008K080641301801E01004J04008K0406,1701001EJ04I02400802I0406,0703001EJ0440064J0C040206,0602070EJ047FFE4I01CF80206,2602099800804418647F03FE00306,263608BE00604410240803FC00126,267C089E004C4010040803F8001F6,264C001E00I4010040807FF8018E,264C0FJ0584010040803IF019E,267C08BE00604410240803IFE1F6,260209A2J047FFE44D87EI0306,06020F12J047FFE4I07FI020640702001EJ0440064I01BC00206,1703N04I024J09E00606,1701001C00804J044J0600406,1301801601004J04488K0C0641300C01EJ0440024488K080641300401K047FFE4488J01006,0300601EJ047FFE4488J0300E80B8030360100441024M0200C80B803822J0441024M0600C80980381EJ0441024M0C00C,01803C1CJ0441824L01C01D,01C01EL0440024L03C019,04C01FI01FC4401E4L078018,00C00F8K0478004L0F8038,00E00FCK04J04K01F003,026007EK04J04K03F003,026007FK04I024K07E007,013003F8K040024K0FE006,013003FCK07FFE4J01FC00E,00B801FEK07FFE4J03FC00C8,009800FFK041824J07F801C,001C00FF8K0182K0FF0019,004E007FEK0182J01FF0038,I0E003FFK0186J07FE0032,I07001FF8I07FFCJ0FFC006,0013801FFCI07E7CI01FF800E,0013800FFEI04L03FFI0C,I09C007FF8O0FFE001C,I04E001FFCN01FFC0039,J06I0FFEN03FF80072,J07I07FF8M07FFI0E,I0138003FFCL01FFCI0C,J09CI0FFEL03FF8001C8,K0EI07FFL07FFI039,K07I01FFCJ01FFCI07,J0338I07FEJ03FFI01E4,J019CI01FF8I0FFCI03C8,L0FJ07FC001FEJ079,L078J0FE003FK0E2,K011CK0780FK03C4,L08FL0C18K0788,L0478K037K01F3,L021EK01CK03C4,M08F8J01CJ01F,M023FJ022J07C2,M010FCI022I01F84,O03F80016I0FC1,N0187F8K0FF08,O060FFE003FF83,O0181LFC0C,P0100JF,Q03L0E,R07E003E,T03E,,::::::::::::::::::::::^FS',
                healthDisclaimer: "^FO120,290^A0R,15,15^FB500,11,0,L,0^FD There may be health risks associated with the consumption of this product. This marijuana’s potency was tested with an allowable plus or minus 15% variance pursuant to 12-43.4-202(3)(a)(IV)(E), C.R.S. There may be additional health risks associated with the consumption of this product for women who are pregnant, breast feeding, or planning on becoming pregnant. Do not drive or operate heavy machinery while using marijuana. The marijuana contained within this package complies with the  mandatory contaminant testing required by rule R 1501. ^FS",
                format: 'CO'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "herban-legends": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_herban_legends"
        },

        express: {
            domain: 'herban-legends.thsuite.com',
            apiDomain: 'herban-legends-api.thsuite.com',
            clientPort: 80,
            port: 3007
        },
        environment: {
            metrcTransfersAreNotAvailable: true,
            autoClockOut: true,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'random',
            companyName: "Herban Legends",
            phone: "(410) 842-9333",
            logoImageLocation: "../../public/img/herbanlegendslogo.png",
            addressInformation: {
                name: "Herban Legends",
                address1: "101 East Chesapeake Avenue",
                address2: "Towson, MD 21286",
                address3: "D-18-00025"
            },
            showPatientInfo: true,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all cannabis products",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product.",
                    "Not for resale.",
                    "Keep out of reach of children",
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: true,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: true,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'medical',
            bulkFlowerInformation: {
                ZPLLogo: '^FO295,620^GFA,1540,1540,14,Q07IFE,P03KFE,O01MFC,O0OF8,N07PF,M01QFE,M07RF8,L01JF8J07IFC,L03IF8L07IF,L0IFCN0IFC,K01FFEO03FFE,K07FF8P0IF,J017FEQ03FFC2,J01BFCR0FFE6,J03EFS07FEE,J07F8U03E,J0YFE,I01YFE,I03YFE,I07YFE8,I0gFEC,001gFEC,001gFEE,003FDXFEF,007F9XFEF8,007F1XFEF8,00FE1XFEFC,01FE1XFEFC,01FC1XFEFE,03FC1XFEFF,03F81CL01FF7M0E7F,07F018L01FFBM067F8,07F01M01FFDM023F8,0FEO01FFEN03FC,0FEO01IFN01FC,1FCO01IFN01FC,1FCO01IFO0FE,:3F8O01IFO07E,3F8O01IFO07F,3F801M01IFM0207F,7F0018L01IFM0603F,7F001CL01IFM0E03F87F001FL01IFL01E03F8FE001XFE03F8FE001XFE01F8::FE001XFE01FC:FC001XFE01FC:::FC001XFE00FC:FC001XFE01FC:FC001EO0FL01E01FCFC001CO07M0601FCFE0018O03O01FCFES01M0201F8FEI08L03001M0201F8FEI0CL03P0601F8FEI0EL038O0E01F87EI0FL03CN03E03F87FI0XFE03F,:3F001XFE03F,3F801XFE07F,3F801XFE07E,1F801XFE07E,1FC01XFE0FE,1FC01XFE0FC,0FE01XFE1FC,:0FE01XFE1F8,07F01XFE3F8,07F81XFE3F,03F81XFE7F,03FC1CFFU0EFE,01FC1BFFU06FE,01FE07FFU02FC,00FF0IFU02FC,007F0IFV0F8,007F9IFU04F,003FDIFU0FF,001KFT01FE,001KFT03FC,I0KFT07FC,I07JFT0FF8,I03JFS01FF,I01JFS03FE,J0JFS0FFC,J07IFR01FF8,J03IF8Q03FF,J01IF8Q0FFE,J01IF8P03FFC,J03IFCP0IF,J07IFEO03FFE,J0KFO0IFC,L01FFN0JF,L01JFCJ0JFE,M07RF8,M01QFE,N03PF8,O07NFC,P0MFE,P01LF,R07FFC,^FS',
                healthDisclaimer: "^FO105,290^A0R,17,17^FB500,11,0,L,0^FD The contents may be lawfully consumed only by the qualifying patient named on the attached label. It is illegal for any person to possess or consume the contents of the package other than the qualifying patient. It is illegal to transfer the package or contents to any person other than for a caregiver to transfer it to a qualifying patient. In the event of an emergency contact Maryland Poison Control at 1.800.222.1222. Keep the package and its contents away from children. ^FS",
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "amedicanna": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_amedicanna"
        },

        express: {
            domain: 'amedicanna.thsuite.com',
            apiDomain: 'amedicanna-api.thsuite.com',
            clientPort: 80,
            port: 3008
        },
        environment: {
            metrcTransfersAreNotAvailable: true,
            autoClockOut: true,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: true, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'random',
            companyName: "AmediCanna Dispensary",
            phone: "(410) 565-6421",
            logoImageLocation: "../../public/img/amedicannalogo.png",
            addressInformation: {
                name: "AmediCanna Dispensary",
                address1: "3531 Washington Blvd., Suite 112",
                address2: "Halethorpe, MD 21227",
                address3: "D-18-00027"
            },
            showPatientInfo: true,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all cannabis products",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product.",
                    "Not for resale.",
                    "Keep out of reach of children",
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: true,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: true,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'medical',
            bulkFlowerInformation: {
                ZPLLogo: '^FO345,540^GFA,1750,1750,7,,K018,K038,K078,J01F8,J03F8,J07F807,J0FF81F,I01FF83F,I03FF87F,I03EF0FE,I07FF0FE,I0FDF0FC,001FFE1F8,001FBE0F,003DFE,003B7C,007EFC003F8,0076E801FF,00FD7807FF,00AFD01FFE,01FAE03FFE,01DFE07FFC,01FD40IF8,03AA81FBF,03FF83B7F,035707DFE,02EE0IFC,02BC1IF,05D817BE,05B00FFC,05201DF00FFC,020033803IF,02I0C00JFC,N0JF8,M01JF,N0IFC,N0IF,J0FE001FC,I0FBDC,I03E738,I04FDFE,0203FBBF8,0101FEFFE,0180FB9FF,05B07CF7FC,05DC1FBDFE,06AE0KF,02FF03JF8,037780JFC,03EA803IFE,03BF4003IF,01F5EI01FF,01DAF,01BBD,00AD68,00FFBC0B,00D6F40FC,007B5E1FF,007F7E1FF8,0035AF0FFC,001IF0FFC,001BDF87FE,I0IF83FE,I07EFC1FF,I07F7C0FF,I03FFC03F,I01FFC0078,J0FFE,J07FE,J03FE,J01FE,K0FE,K07E,K01F,L0F,L07,,::::::::07EJ04,01AJ07,01K07C,06EJ01F8,044K03E,N01F8,N019E,N0187C,N0181F,N0187F8,N01BFF,07EK01FFC,N03FE,M01FF,M07FC,M07F,M07C,M06,,:07E,07EJ07FFC,M07FFC,:O018,P0C,P04,P0C,P0E,M07FFC,07EJ07FFC,M07FF8,M07FF,P08,P0C,P04,P0E,O01E,07EJ07FFC,M07FFC,M07FF8,,::I01FF,I010100FE,I01I03FF8,07E1I07FFC,01A1010799C,J08106184,J0FF0C186,J03C0C186,M0C186,M0418C,I01FF041FC,J0FF061F8,04K021F,,I018F,I010D,I011880FC,I013801FF,J0F103FF8,M07FFC,M0600C,J0FF0C006,I01FF0C006,J0100C004,J01004004,K0F0600C,07E00F07JFC,00CJ07JFC,018J07JFC,0301FF07800FC,0601FF,,I01,M04I03,M07FFC78,:J0C707FFC3,04I06,03I0C,004018,01E03J0F,07806I07FE,0400E300IF8,M01IFC,M03F07E,J08607800E,I010F07I07,I011806I03,I01188CI03,07E0F10CI01,0020F00CI018,M0CI018,J0800CI018,J06004I01,J02C06I01,J02306I03,J02F07I07,J03C038006,03E0E,04018,M03C,J08007E18,0401FF07F0C,J0100E304,J0300C106,J07904106,J0CF06186,I01860309C,M07FFC,K0307FF8,07E00707FF,01001C04,03A1F8,04E008,K06,K0107FFC,M07FFC,:M07078,P08,04N0C,01N04,006M0E,01CM0E,07K07FFC,04K07FFC,M07FF8,M067E,,:::07EJ07FFC,M07FFC,:O018,P0C,P04,P06,P0E,O01C,07EJ07FFC,04K07FFC,M07FF,,::M03C,M07E18,002J07F0C,00EJ0E304,078J0C106,008J04106,002J06186,M0319C,M07FFC,M07FF8,M07FF,M04,04,^FS',
                healthDisclaimer: '^FO105,290^A0R,17,17^FB500,11,0,L,0^FD The contents may be lawfully consumed only by the qualifying patient named on the attached label. It is illegal for any person to possess or consume the contents of the package other than the qualifying patient. It is illegal to transfer the package or contents to any person other than for a caregiver to transfer it to a qualifying patient. In the event of an emergency contact Maryland Poison Control at 1.800.222.1222. Keep the package and its contents away from children. ^FS',
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    },

    "mana-supply": {
        sequelize: {
            dialect: "mysql",

            host: "thsuite-west.cjg3zoypaqqe.us-west-1.rds.amazonaws.com",
            username: "thsuite",
            password: "thsuite",
            database: "thsuite_mana_supply"
        },

        express: {
            domain: 'mana-supply.thsuite.com',
            apiDomain: 'mana-supply-api.thsuite.com',
            clientPort: 80,
            port: 3009
        },
        environment: {
            metrcTransfersAreNotAvailable: true,
            autoClockOut: true,
            autoAllocateEachBarcodes: true,
            receivedDateOnBarcodeLabels: false, //Can only set this or price (NOT BOTH), if both are set, receivedDate takes precedence
            priceOnCannabisBarcodeLabels: false, //Can only set this or received date (NOT BOTH), if both are set, receivedDate takes precedence
            printTransactionLabels: false,
            barcodeGenerationMode: 'random',
            companyName: "Mana Supply Co.",
            phone: "123-456-7890",
            logoImageLocation: "", //TODO
            addressInformation: {
                name: "Mana Supply Co.",
                address1: "Address Line 1", //TODO
                address2: "Address Line 2", //TODO
                address3: "Address Line 3" //TODO
            },
            showPatientInfo: true,
            bottomStaticInfo: {
                lines: [
                    "NEWLINE",
                    "Thank you for your business!",
                    "NEWLINE",
                    "No returns, no refunds, on all cannabis products",
                    "NEWLINE",
                    "It is illegal to sell or transfer this product.",
                    "Not for resale.",
                    "Keep out of reach of children",
                ]
            },
            sendOverdrawnEmail: false,
            patientGramLimitUpdateFailure: true,
            barcodeLabelWidth: 2, //In inches
            realTimeTransactionReporting: true,
            transactionSubmissionMode: 'receipts',
            transactionSubmissionType: 'medical',
            bulkFlowerInformation: {
                ZPLLogo: '',
                healthDisclaimer: "^FO105,290^A0R,17,17^FB500,11,0,L,0^FD The contents may be lawfully consumed only by the qualifying patient named on the attached label. It is illegal for any person to possess or consume the contents of the package other than the qualifying patient. It is illegal to transfer the package or contents to any person other than for a caregiver to transfer it to a qualifying patient. In the event of an emergency contact Maryland Poison Control at 1.800.222.1222. Keep the package and its contents away from children. ^FS",
                format: 'MD'
            },
            rebalanceTransactionsBeforeExport: false,
            requireAuthenticated: false,
        }
    }

};

module.exports = allConfigs;