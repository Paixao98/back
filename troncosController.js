const { connect } = require('./db'); // Ajuste o caminho conforme necessário

connect();

async function selectTroncos(tenant_id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM troncos WHERE tenantid = $1", [tenant_id]);
    return res.rows;
}

async function selectTronco(tenant_id, id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM troncos WHERE tenantid = $1 AND id = $2", [tenant_id, id]);
    return res.rows;
}

async function insertTronco(tenant_id, tronco) {
    const client = await connect();
    const sql = 'INSERT INTO troncos(tenantid, nome, servidor, autenticado, usuario, senha, tech, rdigitos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [tenant_id, tronco.nome, tronco.servidor, tronco.autenticado, tronco.usuario, tronco.senha, tronco.tech, tronco.rdigitos];
    await client.query(sql, values);
}

async function updateTronco(tenant_id, id, tronco) {
    const client = await connect();
    const sql = 'UPDATE troncos SET nome=$1, servidor=$2, autenticado=$3, usuario=$4, senha=$5, tech=$6, rdigitos=$7 WHERE tenantid=$8 AND id=$9';
    const values = [tronco.nome, tronco.servidor, tronco.autenticado, tronco.usuario, tronco.senha, tronco.tech, tronco.rdigitos, tenant_id, id];
    await client.query(sql, values);
}

async function deleteTronco(tenant_id, id) {
    const client = await connect();
    const sql = 'DELETE FROM troncos WHERE tenantid=$1 AND id=$2';
    const values = [tenant_id, id];
    await client.query(sql, values);
}

module.exports = {
    selectTroncos,
    selectTronco,
    insertTronco,
    updateTronco,
    deleteTronco
};