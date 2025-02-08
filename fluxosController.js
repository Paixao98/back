const { connect } = require('./db'); // Ajuste o caminho conforme necessário

connect();

async function selectFluxos() {
    const client = await connect();
    const res = await client.query("SELECT * FROM fluxos");
    return res.rows;
}

module.exports = {
    selectFluxos
};