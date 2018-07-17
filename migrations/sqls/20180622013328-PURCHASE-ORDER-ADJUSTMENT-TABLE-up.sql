/* Replace with your SQL commands */

CREATE TABLE `purchase_orders` (
  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `userId` char(36) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `packageId` char(36) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `itemId` char(36) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `version` int(11) DEFAULT '0',
  `amount` decimal(8,2) DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `packageId` (`packageId`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `packages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;