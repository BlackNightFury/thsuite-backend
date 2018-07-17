ALTER TABLE `store_settings`
ADD COLUMN `enableDrawerLimit` TINYINT(1) NOT NULL DEFAULT '0' AFTER `dailySalesEmailList`,
ADD COLUMN `drawerAmountForAlert` INT(11) NULL DEFAULT NULL AFTER `enableDrawerLimit`;
