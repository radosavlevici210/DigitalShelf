CREATE TABLE "hardware_monitoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"gpu_name" text NOT NULL,
	"temperature" integer,
	"power_usage" integer,
	"fan_speed" integer,
	"hashrate" real,
	"status" text DEFAULT 'online',
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mining_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pool_id" integer NOT NULL,
	"worker_name" text NOT NULL,
	"power_limit" integer DEFAULT 85,
	"memory_clock" integer DEFAULT 0,
	"core_clock" integer DEFAULT 0,
	"auto_restart" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "mining_pools" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"port" integer NOT NULL,
	"is_active" boolean DEFAULT false,
	"fee" real NOT NULL,
	"latency" integer,
	"difficulty" text,
	"status" text DEFAULT 'offline'
);
--> statement-breakpoint
CREATE TABLE "mining_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hashrate" real NOT NULL,
	"shares_submitted" integer DEFAULT 0,
	"shares_accepted" integer DEFAULT 0,
	"daily_earnings" real DEFAULT 0,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"wallet_address" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" real NOT NULL,
	"transaction_hash" text,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending',
	"timestamp" timestamp DEFAULT now()
);
