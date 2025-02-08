const jwt = require('jsonwebtoken');
const secretKey = 'Grecia13Terra2313'; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Salva a informação do usuário no objeto req
        next();
    });
}

module.exports = authenticateToken;