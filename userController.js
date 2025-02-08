const { connect } = require('./db'); // Ajuste o caminho conforme necessário
const bcrypt = require('bcrypt');
const saltRounds = 10;


connect();

async function selectUsers() {
    const client = await connect();
    const res = await client.query("SELECT * FROM users");
    return res.rows;
}

async function selectUser(id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM users WHERE ID = $1", [id]);
    return res.rows;
}

async function insertUser(user) {
    const client = await connect();
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const sql = 'INSERT INTO users(username, password, role, tenant_id) VALUES ($1, $2, $3, $4)';
    const values = [user.username, hashedPassword, user.role, user.tenant_id];
    await client.query(sql, values);
}

async function updateUser(id, user) {
    const client = await connect();
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const sql = 'UPDATE users SET username=$1, password=$2, role=$3, tenant_id=$4 WHERE id=$5';
    const values = [user.username, hashedPassword, user.role, user.tenant_id, id];
    await client.query(sql, values);
}

async function deleteUser(id) {
    const client = await connect();
    const sql = 'DELETE FROM users WHERE id=$1';
    const values = [id];
    await client.query(sql, values);
}

module.exports = {
    selectUsers,
    selectUser,
    insertUser,
    updateUser,
    deleteUser
};