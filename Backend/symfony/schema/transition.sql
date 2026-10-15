CREATE TABLE `transition` (
  `id` binary(16) NOT NULL,
  `method` enum('mix','cook','shape','bake','fry') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;