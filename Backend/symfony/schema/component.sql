CREATE TABLE `component` (
  `id` binary(16) NOT NULL,
  `name` varchar(180),
  `transition_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `component_transition_idx` (`transition_id`),
  CONSTRAINT `component_transition_fk` FOREIGN KEY (`transition_id`) REFERENCES `transition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;