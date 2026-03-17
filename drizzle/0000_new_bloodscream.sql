CREATE TABLE `faq_translations` (
	`faq_id` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`language` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`is_active` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `religious_stories` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`image_url` text,
	`media_url` text,
	`is_active` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `religious_story_translations` (
	`story_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`language` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`type` integer NOT NULL,
	`cover_image_url` text,
	`content_image_url` text,
	`is_active` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `story_translations` (
	`story_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`language` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `template_translations` (
	`template_id` text NOT NULL,
	`text` text NOT NULL,
	`language` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`image_url` text,
	`is_active` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
