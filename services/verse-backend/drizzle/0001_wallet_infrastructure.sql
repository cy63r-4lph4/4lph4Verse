CREATE TABLE "profile_wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"address" varchar(42) NOT NULL,
	"wallet_type" varchar(32) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"supported_chains" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_profile_wallets_address" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "verse_guardians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verse_id" varchar(255) NOT NULL,
	"guardian_address" varchar(42) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"epoch" integer DEFAULT 0 NOT NULL,
	"threshold" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verse_recovery_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verse_id" varchar(255) NOT NULL,
	"recovery_type" varchar(32) NOT NULL,
	"pending_new_owner" varchar(42) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"eta" timestamp,
	"nonce" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"verse_profile_id" text NOT NULL,
	"wallet_identity_id" text NOT NULL,
	"derivation_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_wallets_profile" UNIQUE("verse_profile_id"),
	CONSTRAINT "uq_wallets_identity_id" UNIQUE("wallet_identity_id")
);
--> statement-breakpoint
CREATE TABLE "wallet_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"chain_id" integer NOT NULL,
	"address" text NOT NULL,
	"deployment_status" text DEFAULT 'predicted' NOT NULL,
	"deployed_at" timestamp with time zone,
	"deployed_at_block" bigint,
	"is_address_parity" boolean DEFAULT true NOT NULL,
	"parity_variant_reason" text,
	"derivation_init_controller" text,
	"kernel_factory_address" text NOT NULL,
	"kernel_impl_address" text NOT NULL,
	"passkey_validator_address" text NOT NULL,
	"entry_point_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_wallet_accounts_wallet_chain" UNIQUE("wallet_id","chain_id"),
	CONSTRAINT "chk_wallet_accounts_deployment_status" CHECK ("wallet_accounts"."deployment_status" IN ('predicted', 'deploying', 'deployed'))
);
--> statement-breakpoint
CREATE TABLE "wallet_controllers" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"controller_type" text NOT NULL,
	"controller_identifier" text NOT NULL,
	"validator_contract_address" text,
	"on_chain_public_data" text,
	"can_sign_transactions" boolean DEFAULT true NOT NULL,
	"can_manage_controllers" boolean DEFAULT false NOT NULL,
	"can_initiate_recovery" boolean DEFAULT false NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"confirmed_on_chain" boolean DEFAULT false NOT NULL,
	"confirmed_at_block" bigint,
	CONSTRAINT "uq_wallet_controllers_wallet_identifier" UNIQUE("wallet_id","controller_identifier"),
	CONSTRAINT "chk_wallet_controllers_type" CHECK ("wallet_controllers"."controller_type" IN ('passkey', 'mpc', 'hardware', 'guardian'))
);
--> statement-breakpoint
CREATE TABLE "connected_wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"verse_profile_id" text NOT NULL,
	"address" text NOT NULL,
	"wallet_type" text DEFAULT 'external' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_connected_wallets_profile_address" UNIQUE("verse_profile_id","address")
);
--> statement-breakpoint
CREATE TABLE "supported_chains" (
	"chain_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rpc_url" text NOT NULL,
	"explorer_url" text,
	"nick_factory_verified" boolean DEFAULT false NOT NULL,
	"rip7212_verified" boolean DEFAULT false NOT NULL,
	"kernel_factory_address" text,
	"kernel_impl_address" text,
	"passkey_validator_address" text,
	"entry_point_address" text,
	"bundler_url" text,
	"paymaster_url" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"is_testnet" boolean DEFAULT false NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_wallets" ADD CONSTRAINT "profile_wallets_profile_id_verse_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verse_guardians" ADD CONSTRAINT "verse_guardians_verse_id_verse_profiles_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verse_recovery_requests" ADD CONSTRAINT "verse_recovery_requests_verse_id_verse_profiles_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_verse_profile_id_verse_profiles_id_fk" FOREIGN KEY ("verse_profile_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_accounts" ADD CONSTRAINT "wallet_accounts_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_controllers" ADD CONSTRAINT "wallet_controllers_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connected_wallets" ADD CONSTRAINT "connected_wallets_verse_profile_id_verse_profiles_id_fk" FOREIGN KEY ("verse_profile_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unq_guardian_per_verse" ON "verse_guardians" USING btree ("verse_id","guardian_address","epoch");--> statement-breakpoint
CREATE INDEX "idx_verse_recovery" ON "verse_recovery_requests" USING btree ("verse_id","active");