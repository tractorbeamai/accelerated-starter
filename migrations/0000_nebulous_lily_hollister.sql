CREATE TABLE
	"posts" (
		"id" serial PRIMARY KEY NOT NULL,
		"title" text NOT NULL,
		"content" text NOT NULL,
		"status" text DEFAULT 'draft' NOT NULL,
		"created_at" timestamp DEFAULT now () NOT NULL,
		"updated_at" timestamp DEFAULT now () NOT NULL
	);
