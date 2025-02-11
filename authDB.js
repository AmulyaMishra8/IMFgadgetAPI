const { Client } = require('pg')

const client = new Client({
    connectionString:
        "postgresql://neondb_owner:npg_tEhQ6N8ZHRmB@ep-withered-meadow-a5b0jk9t-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
});

async function createUserTable(){
    try{
        await client.connect();
        console.log("connected to database");

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
            `)
        console.log("table created successfully");
    }
    catch(error){
        console.error("error in creating table")
    }
        
};

createUserTable();

module.exports = client; 