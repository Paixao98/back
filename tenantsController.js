const { connect } = require('./db'); // Ajuste o caminho conforme necessário

connect();

async function selectTenants() {
    const client = await connect();
    const res = await client.query("SELECT * FROM tenants");
    return res.rows;
}

async function selectTenant(id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM tenants WHERE ID = $1", [id]);
    return res.rows;
}

async function insertTenant(tenant) {
    const client = await connect();
    const sql = 'INSERT INTO tenants(name, max_channels, max_extensions) VALUES ($1, $2, $3)';
    const values = [tenant.name, tenant.max_channels, tenant.max_extensions];
    await client.query(sql, values);
}

async function updateTenant(id, tenant) {
    const client = await connect();
    const sql = 'UPDATE tenants SET name=$1, max_channels=$2, max_extensions=$3 WHERE id=$4';
    const values = [tenant.name, tenant.max_channels, tenant.max_extensions, id];
    await client.query(sql, values);
}

async function deleteTenant(id) {
    const client = await connect();
    const sql = 'DELETE FROM tenants WHERE id=$1';
    const values = [id];
    await client.query(sql, values);
}

module.exports = {
    selectTenants,
    selectTenant,
    insertTenant,
    updateTenant,
    deleteTenant
};