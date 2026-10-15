CREATE TABLE `transition_component` (
  `id` binary(16) NOT NULL,
  `transition_id` binary(16) NOT NULL,
  `component_id` binary(16) NOT NULL,
  `amount` int unsigned NOT NULL,
  `unit` enum('g','ml','stk','portion') NOT NULL,
  `work_time_in_seconds` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transition_component_transition_idx` (`transition_id`),
  KEY `transition_component_component_idx` (`component_id`),
  CONSTRAINT `transition_component_transition_fk` FOREIGN KEY (`transition_id`) REFERENCES `transition` (`id`),
  CONSTRAINT `transition_component_component_fk` FOREIGN KEY (`component_id`) REFERENCES `component` (`id`),
  CONSTRAINT `transition_component_amount_positive` CHECK ((`amount` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;