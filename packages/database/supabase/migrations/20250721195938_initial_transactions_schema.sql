-- Custom types
CREATE TYPE "public"."transaction_type" AS ENUM (
    'credit',
    'debit'
);

ALTER TYPE "public"."transaction_type" OWNER TO "postgres";
COMMENT ON TYPE "public"."transaction_type" IS 'The available types of transaction';

-- Functions
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

-- Tables
CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "text" NOT NULL,
    "type" "public"."transaction_type" NOT NULL,
    "description" "text" NOT NULL,
    "value" numeric(10,2) NOT NULL,
    "date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    CONSTRAINT "transactions_type_check" CHECK ((("type")::"text" = ANY (ARRAY[('credit'::character varying)::"text", ('debit'::character varying)::"text"]))),
    CONSTRAINT "transactions_value_check" CHECK (("value" > (0)::numeric))
);

ALTER TABLE "public"."transactions" OWNER TO "postgres";
COMMENT ON COLUMN "public"."transactions"."user_id" IS 'Id of the user that owns this transaction.';

-- Primary keys
ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");

-- Indexes
CREATE INDEX "idx_transactions_created_at" ON "public"."transactions" USING "btree" ("created_at" DESC);
CREATE INDEX "idx_transactions_date" ON "public"."transactions" USING "btree" ("date" DESC);
CREATE INDEX "idx_transactions_type" ON "public"."transactions" USING "btree" ("type");

-- Triggers
CREATE OR REPLACE TRIGGER "update_transactions_updated_at" BEFORE UPDATE ON "public"."transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Foreign keys
ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Row Level Security policies
CREATE POLICY "Enable delete for users based on user_id" ON "public"."transactions" FOR DELETE USING (((SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Enable insert for authenticated users only" ON "public"."transactions" FOR INSERT TO "authenticated" WITH CHECK (true);
CREATE POLICY "Enable update for users based on user_id" ON "public"."transactions" FOR UPDATE USING (((SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (((SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Enable users to view their own transactions only" ON "public"."transactions" FOR SELECT TO "authenticated" USING (((SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;