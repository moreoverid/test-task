CREATE TABLE `contacts` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(255),
	`surname` varchar(255),
	PRIMARY KEY (`id`)
);

CREATE TABLE `phones` (
	`id` int NOT NULL AUTO_INCREMENT,
	`number` varchar(100) NOT NULL,
	`contact_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `phones` ADD CONSTRAINT `phones_fk0` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
