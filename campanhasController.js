const { connect } = require('./db'); // Ajuste o caminho conforme necessário

connect();

async function selectCampanhas(tenant_id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM campanhas WHERE tenant_id = $1", [tenant_id]);
    return res.rows;
}

async function selectCampanha(tenant_id, id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM campanhas WHERE tenant_id = $1 AND id = $2", [tenant_id, id]);
    return res.rows;
}

async function insertCampanha(tenant_id, campanha) {
    const client = await connect();
    const sql = 'INSERT INTO campanhas(tenant_id, nome, vigencia_inicio, vigencia_fim, max_tentativas, tronco, parametro1, parametro2, parametro3, agendamento_hora, agendamento_fim, dia_semana, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
    const values = [tenant_id, campanha.nome, campanha.vigencia_inicio, campanha.vigencia_fim, campanha.max_tentativas, campanha.tronco, campanha.parametro1, campanha.parametro2, campanha.parametro3, campanha.agendamento_hora, campanha.agendamento_fim, campanha.dia_semana, campanha.status];
    await client.query(sql, values);
}

async function updateCampanha(tenant_id, id, campanha) {
    const client = await connect();
    const sql = 'UPDATE campanhas SET nome=$1, vigencia_inicio=$2, vigencia_fim=$3, max_tentativas=$4, tronco=$5, parametro1=$6, parametro2=$7, parametro3=$8, agendamento_hora=$9, agendamento_fim=$10, dia_semana=$11, status=$12 WHERE tenant_id=$13 AND id=$14';
    const values = [campanha.nome, campanha.vigencia_inicio, campanha.vigencia_fim, campanha.max_tentativas, campanha.tronco, campanha.parametro1, campanha.parametro2, campanha.parametro3, campanha.agendamento_hora, campanha.agendamento_fim, campanha.dia_semana, campanha.status, tenant_id, id];
    await client.query(sql, values);
}

async function deleteCampanha(tenant_id, id) {
    const client = await connect();
    const sql = 'DELETE FROM campanhas WHERE tenant_id=$1 AND id=$2';
    const values = [tenant_id, id];
    await client.query(sql, values);
}

module.exports = {
    selectCampanhas,
    selectCampanha,
    insertCampanha,
    updateCampanha,
    deleteCampanha
};