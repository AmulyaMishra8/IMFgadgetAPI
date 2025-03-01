const express = require('express');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');
const Chance = require('chance');
const { router: authRoutes, authorization } = require("./auth");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { client, initDatabase } = require('./db'); 
const cors = require("cors");

const chance = new Chance();
const app = express();
const port = 3000;
app.use(cors({ origin: "*" }));

async function startServer() {
    try {
        // Initialize database
        await initDatabase();

        // Middleware
        app.use(express.json());
        
        // Auth routes
         app.use("/auth", authRoutes);

        // Gadget routes
        app.post('/gadgets', authorization, async (req, res) => {
            const name = uniqueNamesGenerator({
                dictionaries: [['The'], adjectives, animals],
                separator: ' ',
                style: 'capital'
            });

            try {
                const result = await client.query(
                    `INSERT INTO gadgets (name) VALUES ($1) RETURNING *`,
                    [name]
                );

                console.log("Gadget added:", result.rows[0]);
                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error("Error adding gadget:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        app.get('/gadgets', authorization, async (req, res) => {
            const { status } = req.query;
            
            try {
                let query = 'SELECT * FROM gadgets';
                const values = [];
         
                if (status) {
                    query += ' WHERE status = $1';
                    values.push(status);
                }
         
                const result = await client.query(query, values);
                
                const formattedGadgets = result.rows.map(gadget => {
                    const successProbability = chance.integer({ min: 50, max: 100 });
                    return {
                        id: gadget.id,
                        name: gadget.name,
                        description: `${gadget.name} - ${successProbability}% success probability`,
                        status: gadget.status
                    };
                });
        
                res.status(200).json(formattedGadgets);
            } catch (error) {
                console.error("Error retrieving gadgets:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        app.patch('/gadgets/:id', authorization, async (req, res) => {
            const { id } = req.params;
            const { status } = req.body;
        
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({ error: "Invalid UUID format" });
            }
        
            const validStatuses = ['Available', 'Deployed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }
        
            try {
                const query = `
                    UPDATE gadgets 
                    SET status = $1
                    WHERE id = $2::uuid 
                    RETURNING *
                `;
        
                const result = await client.query(query, [status, id]);
        
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: "Gadget not found" });
                }
        
                res.status(200).json(result.rows[0]);
            } catch (error) {
                console.error("Error updating gadget status:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        app.delete('/gadgets/:id', authorization, async (req, res) => {
            const { id } = req.params;
         
            try {
                const query = `
                    UPDATE gadgets 
                    SET 
                        status = 'Decommissioned', 
                        decommissioned_at = CURRENT_TIMESTAMP
                    WHERE id = $1 
                    RETURNING *
                `;
         
                const result = await client.query(query, [id]);
         
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: "Gadget not found" });
                }
         
                res.status(200).json({
                    message: "Gadget decommissioned successfully",
                    gadget: result.rows[0]
                });
            } catch (error) {
                console.error("Error decommissioning gadget:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        app.post('/gadgets/:id/self-destruct', authorization, async (req, res) => {
            const { id } = req.params;
            const { confirmationCode } = req.body;
         
            // Generate a random 6-digit confirmation code
            const expectedCode = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`Expected confirmation code: ${expectedCode}`);
         
            try {
                if (confirmationCode !== expectedCode) {
                    return res.status(400).json({ 
                        error: "Invalid confirmation code",
                        hint: "A new code is required for self-destruct",
                        expected_code: `${expectedCode} was the expected code` 
                    });
                }
         
                const query = `
                    UPDATE gadgets 
                    SET 
                        status = 'Destroyed', 
                        decommissioned_at = CURRENT_TIMESTAMP
                    WHERE id = $1 
                    RETURNING *
                `;
         
                const result = await client.query(query, [id]);
         
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: "Gadget not found" });
                }
         
                res.status(200).json({
                    message: "Self-destruct sequence completed",
                    gadget: result.rows[0]
                });
            } catch (error) {
                console.error("Self-destruct sequence error:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // Swagger UI setup (after all other routes)
        const swaggerDocument = YAML.load("./swagger.yaml");
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

process.on('SIGTERM', async () => {
    try {
        await client.end();
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});


startServer();