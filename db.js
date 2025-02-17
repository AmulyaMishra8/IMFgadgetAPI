const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_tEhQ6N8ZHRmB@ep-withered-meadow-a5b0jk9t-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    max: 10,  // Max 10 connections
    idleTimeoutMillis: 30000,  // Close idle connections after 30 seconds
    connectionTimeoutMillis: 20000  // Timeout if DB doesn’t respond in 20s
});

// Function to initialize the table
async function createGadgetsTable() {
    const client = await pool.connect();
    try {
        console.log("Connected to database");

        // Ensure ENUM type is created safely
        await client.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gadget_status') THEN
                    CREATE TYPE gadget_status AS ENUM (
                        'Available', 
                        'Deployed', 
                        'Destroyed', 
                        'Decommissioned'
                    );
                END IF;
            END $$;
        `);

        // Create the table
        await client.query(`
            CREATE TABLE IF NOT EXISTS gadgets (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                status gadget_status NOT NULL DEFAULT 'Available',
                decommissioned_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Gadgets table created successfully");
    } catch (error) {
        console.error("Error creating gadgets table:", error);
    } finally {
        client.release();  // ✅ Release instead of closing the connection
    }
}

// Export pool for API routes
module.exports = { pool, createGadgetsTable };
