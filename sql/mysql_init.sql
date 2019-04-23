CREATE TABLE `contacts` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(255),
	`surname` varchar(255),
	`user_id` int,
	PRIMARY KEY (`id`)
);

CREATE TABLE `phones` (
	`id` int NOT NULL AUTO_INCREMENT,
	`number` varchar(100) NOT NULL,
	`contact_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `users` (
	`id` int NOT NULL AUTO_INCREMENT,
	`session_id` varchar(255) UNIQUE,
	`created_at` DATETIME,
	PRIMARY KEY (`id`)
);

ALTER TABLE `contacts` ADD CONSTRAINT `contacts_fk0` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `phones` ADD CONSTRAINT `phones_fk0` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
