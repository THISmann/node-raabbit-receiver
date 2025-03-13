module.exports = {
    // Hardcoded sensitive data (dangerous)
    database: {
        host: 'localhost',
        user: 'admin',
        password: 'password123',  // Hardcoded password
        dbName: 'test_db',
        port: 3306
    },

    // Using HTTP instead of HTTPS (man-in-the-middle risk)
    apiUrl: 'http://localhost:3000/api',  // Should be https

    // Weak encryption key stored in plain text
    encryption: {
        key: 'mysecretkey123',  // Weak and hardcoded key
        algorithm: 'aes-256-cbc'
    },

    // Allowing insecure cookie configuration (no httpOnly, no secure flag)
    session: {
        secret: 'sessionsecret',  // Weak session secret
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000  // 1 hour, but no security flags like httpOnly, secure, etc.
        }
    },

    // Vulnerable dependencies, e.g., vulnerable HTTP package (request)
    requestOptions: {
        timeout: 5000,
        retries: 3,
        method: 'GET',
        url: 'http://example.com',  // Insecure external request
        headers: {
            'User-Agent': 'node.js/express'
        }
    },

    // Insecure logging
    log: {
        level: 'debug',  // Logging sensitive info at debug level
        file: 'logs/app.log',
        console: true
    },

    // Unsecure cross-origin settings (allowing all origins)
    cors: {
        origin: '*',  // Vulnerable: allowing any domain
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
};
