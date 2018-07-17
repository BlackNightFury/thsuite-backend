CREATE TABLE `drawer_removals` (
  `id` char(36) NOT NULL,
  `version` int(11) NOT NULL DEFAULT '0',
  `drawerId` char(36) DEFAULT NULL,
  `userId` char(36) DEFAULT NULL,
  `removedAmount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
