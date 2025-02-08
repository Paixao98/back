async function connect() {
    
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNETION_STRING
    });

    const client = await pool.connect();
    console.log('Conectado ao banco de dados');

    const res = await client.query('select now()');
    console.log(res.rows[0]);

    client.release();

    global.connection = pool;
    return pool.connect()
}

connect();

const jwt = require('jsonwebtoken');
const secretKey = 'Grecia13Terra2313'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function loginUser(username, password) {
    const user = await verifyUser(username, password);
    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '24h' });
        console.log(`Token generated: ${token}`); // Log do token gerado
        return { token, tenant_id: user.tenant_id };
    }
    console.log('Invalid username or password'); // Log se o usuário ou senha forem inválidos
    throw new Error('usuario ou senha incorretos');
}

async function verifyUser(username, password) {
    const client = await connect();
    const res = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    if (res.rows.length > 0) {
        const user = res.rows[0];
        console.log(`User found: ${JSON.stringify(user)}`); // Log do usuário encontrado
        const match = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${match}`); // Log do resultado da comparação de senha
        if (match) {
            return user;
        }
    } else {
        console.log('User not found'); // Log se o usuário não for encontrado
    }
    return null;
}


module.exports = {
    connect,
    verifyUser, 
    loginUser
};