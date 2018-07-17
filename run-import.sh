node bin/sync-sequelize
echo 'Synced Database'

node bin/metrc-import/init/init-users
echo 'Initialized default users'

node bin/metrc-import/init/init-discounts
echo 'Initialized default discounts'

node bin/metrc-import/init/init-patient-groups
echo 'Initialized default patient groups'

node bin/metrc-import/index