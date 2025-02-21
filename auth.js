const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("./authDB"); 


const router = express.Router();

router.use(express.json());

const SECRET_KEY = "secret"; 

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: "2h" 
        });

        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

function authorization(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach user data to request
        next(); 
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
}

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
            username,
            hashedPassword
        ]);

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = {router,authorization};


