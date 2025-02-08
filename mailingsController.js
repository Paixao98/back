const { connect } = require('./db'); // Ajuste o caminho conforme necessário

connect();

async function tenantExists(tenant_id) {
    const client = await connect();
    const res = await client.query("SELECT 1 FROM tenants WHERE id = $1", [tenant_id]);
    return res.rowCount > 0;
}

async function selectMailings(tenant_id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM mailings WHERE tenant_id = $1", [tenant_id]);
    return res.rows;
}

async function selectMailing(tenant_id, id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM mailings WHERE tenant_id = $1 AND id = $2", [tenant_id, id]);
    return res.rows;
}

async function insertMailing(tenant_id, mailing) {
    if (!await tenantExists(tenant_id)) {
        throw new Error(`Tenant ID ${tenant_id} não existe`);
    }
    const client = await connect();
    const sql = 'INSERT INTO mailings(tenant_id, campanha_id, nome, status) VALUES ($1, $2, $3, $4)';
    const values = [tenant_id, mailing.campanha_id, mailing.nome, mailing.status];
    await client.query(sql, values);
}

async function updateMailing(tenant_id, id, mailing) {
    if (!await tenantExists(tenant_id)) {
        throw new Error(`Tenant ID ${tenant_id} não existe`);
    }
    const client = await connect();
    const sql = 'UPDATE mailings SET campanha_id=$1, nome=$2, status=$3 WHERE tenant_id=$4 AND id=$5';
    const values = [mailing.campanha_id, mailing.nome, mailing.status, tenant_id, id];
    await client.query(sql, values);
}

async function deleteMailing(tenant_id, id) {
    const client = await connect();
    const sql = 'DELETE FROM mailings WHERE tenant_id=$1 AND id=$2';
    const values = [tenant_id, id];
    await client.query(sql, values);
}

module.exports = {
    selectMailings,
    selectMailing,
    insertMailing,
    updateMailing,
    deleteMailing
};