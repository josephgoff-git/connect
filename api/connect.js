import mysql from "mysql"

export const db = mysql.createConnection({
    host: "socialmysqlserver.mysql.database.azure.com",
    user: "socialmysqluser",
    password: "Unlocksomething9*",
    database: "social"
})