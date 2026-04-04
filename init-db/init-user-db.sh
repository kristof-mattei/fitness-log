#!/usr/bin/env bash
set -e

psql --set=ON_ERROR_STOP=1 --set=postgres_password="$POSTGRES_PASSWORD" --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER "fitness-log" WITH PASSWORD :'postgres_password';
  CREATE DATABASE "fitness-log" WITH OWNER "fitness-log";
  -- GRANT ALL PRIVILEGES ON DATABASE "fitness-log" TO "fitness-log";
EOSQL
