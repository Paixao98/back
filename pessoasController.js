const { connect } = require('./db'); // Ajuste o caminho conforme necessário

connect();

async function tenantExists(tenant_id) {
    const client = await connect();
    const res = await client.query("SELECT 1 FROM tenants WHERE id = $1", [tenant_id]);
    return res.rowCount > 0;
}

async function selectPessoas(mailing_id, page = 1, limit = 50) {
    const client = await connect();
    const offset = (page - 1) * limit;
    const res = await client.query("SELECT * FROM pessoas WHERE mailing_id = $1 LIMIT $2 OFFSET $3", [mailing_id, limit, offset]);
    return res.rows;
}

async function selectPessoa(tenant_id, id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM pessoas WHERE tenant_id = $1 AND id = $2", [tenant_id, id]);
    return res.rows;
}

async function insertPessoa(tenant_id, pessoa) {
    if (!await tenantExists(tenant_id)) {
        throw new Error(`Tenant ID ${tenant_id} não existe`);
    }
    const client = await connect();
    const sql = 'INSERT INTO pessoas(tenant_id, mailing_id, nome, identificacao, telefone1, telefone2, telefone3, telefone4, userfield1, userfield2, userfield3, userfield4, userfield5, userfield6, userfield7, userfield8, userfield9, userfield10, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)';
    const values = [tenant_id, pessoa.mailing_id, pessoa.nome, pessoa.identificacao, pessoa.telefone1, pessoa.telefone2, pessoa.telefone3, pessoa.telefone4, pessoa.userfield1, pessoa.userfield2, pessoa.userfield3, pessoa.userfield4, pessoa.userfield5, pessoa.userfield6, pessoa.userfield7, pessoa.userfield8, pessoa.userfield9, pessoa.userfield10, 1];
    await client.query(sql, values);
}

async function updatePessoa(tenant_id, id, pessoa) {
    if (!await tenantExists(tenant_id)) {
        throw new Error(`Tenant ID ${tenant_id} não existe`);
    }
    const client = await connect();
    const sql = 'UPDATE pessoas SET mailing_id=$1, nome=$2, identificacao=$3, telefone1=$4, telefone2=$5, telefone3=$6, telefone4=$7, userfield1=$8, userfield2=$9, userfield3=$10, userfield4=$11, userfield5=$12, userfield6=$13, userfield7=$14, userfield8=$15, userfield9=$16, userfield10=$17, status=$18 WHERE tenant_id=$19 AND id=$20';
    const values = [pessoa.mailing_id, pessoa.nome, pessoa.identificacao, pessoa.telefone1, pessoa.telefone2, pessoa.telefone3, pessoa.telefone4, pessoa.userfield1, pessoa.userfield2, pessoa.userfield3, pessoa.userfield4, pessoa.userfield5, pessoa.userfield6, pessoa.userfield7, pessoa.userfield8, pessoa.userfield9, pessoa.userfield10, pessoa.status, tenant_id, id];
    await client.query(sql, values);
}

async function deletePessoa(tenant_id, id) {
    const client = await connect();
    const sql = 'DELETE FROM pessoas WHERE tenant_id=$1 AND id=$2';
    const values = [tenant_id, id];
    await client.query(sql, values);
}

async function downloadExemplo(res) {
    const fields = ['nome', 'identificacao', 'telefone1', 'telefone2', 'telefone3', 'telefone4', 'userfield1', 'userfield2', 'userfield3', 'userfield4', 'userfield5', 'userfield6', 'userfield7', 'userfield8', 'userfield9', 'userfield10'];
    const csv = parse([], { fields, delimiter: ';' });
    res.header('Content-Type', 'text/csv');
    res.attachment('exemplo.csv');
    res.send(csv);
}

async function addPessoasCsv(tenant_id, mailing_id, filePath) {
    if (!await tenantExists(tenant_id)) {
        throw new Error(`Tenant ID ${tenant_id} não existe`);
    }
    const client = await connect();
    const pessoas = [];
    fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
            pessoas.push({
                tenant_id,
                mailing_id,
                nome: row.nome,
                identificacao: row.identificacao,
                telefone1: row.telefone1,
                telefone2: row.telefone2,
                telefone3: row.telefone3,
                telefone4: row.telefone4,
                userfield1: row.userfield1,
                userfield2: row.userfield2,
                userfield3: row.userfield3,
                userfield4: row.userfield4,
                userfield5: row.userfield5,
                userfield6: row.userfield6,
                userfield7: row.userfield7,
                userfield8: row.userfield8,
                userfield9: row.userfield9,
                userfield10: row.userfield10,
                status: 1
            });
        })
        .on('end', async () => {
            const sql = 'INSERT INTO pessoas(tenant_id, mailing_id, nome, identificacao, telefone1, telefone2, telefone3, telefone4, userfield1, userfield2, userfield3, userfield4, userfield5, userfield6, userfield7, userfield8, userfield9, userfield10, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)';
            for (const pessoa of pessoas) {
                const values = [pessoa.tenant_id, pessoa.mailing_id, pessoa.nome, pessoa.identificacao, pessoa.telefone1, pessoa.telefone2, pessoa.telefone3, pessoa.telefone4, pessoa.userfield1, pessoa.userfield2, pessoa.userfield3, pessoa.userfield4, pessoa.userfield5, pessoa.userfield6, pessoa.userfield7, pessoa.userfield8, pessoa.userfield9, pessoa.userfield10, pessoa.status];
                await client.query(sql, values);
            }
        });
}

module.exports = {
    selectPessoas,
    selectPessoa,
    insertPessoa,
    updatePessoa,
    deletePessoa,
    downloadExemplo,
    addPessoasCsv
};