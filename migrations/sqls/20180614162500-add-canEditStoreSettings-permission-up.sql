/* Replace with your SQL commands */
ALTER TABLE 'permissions' 
ADD COLUMN 'canEditStoreSettings' TINYINT(1) NULL DEFAULT 0 AFTER 'canEditLineItems'