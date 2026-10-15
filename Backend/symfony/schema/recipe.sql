CREATE TABLE `recipe` (
  `id` binary(16) NOT NULL,
  `component_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_component_idx` (`component_id`),
  CONSTRAINT `recipe_component_fk` FOREIGN KEY (`component_id`) REFERENCES `component` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
