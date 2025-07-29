-- Database configuration
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Schema comment
COMMENT ON SCHEMA "public" IS 'standard public schema';

-- Extensions
-- CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
-- CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
-- CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

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

-- Table configuration
SET default_tablespace = '';
SET default_table_access_method = "heap";

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
-- -- Publications
-- ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

-- -- Schema privileges
-- GRANT USAGE ON SCHEMA "public" TO "postgres";
-- GRANT USAGE ON SCHEMA "public" TO "anon";
-- GRANT USAGE ON SCHEMA "public" TO "authenticated";
-- GRANT USAGE ON SCHEMA "public" TO "service_role";

-- -- Function permissions
-- GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
-- GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
-- GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

-- -- Table permissions
-- GRANT ALL ON TABLE "public"."transactions" TO "anon";
-- GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
-- GRANT ALL ON TABLE "public"."transactions" TO "service_role";

-- -- Default privileges
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

RESET ALL;
