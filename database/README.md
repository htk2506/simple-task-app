# simple-task-app-databse
Script for creating the simple_task_app database in PostgresSql.

The script was created as a schema backup generated from this command:
> pg_dump -h \<host> -p \<port> -U \<user (postgres)> -s -c -C -d simple_task_app -f create_database.sql

To use the script to build the database:
> psql -U \<user (postgres)> -f create_database.sql