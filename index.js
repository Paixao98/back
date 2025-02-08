require("dotenv").config();

const userC = require("./userController");
const tenantsC = require("./tenantsController");
const campanhasController = require('./campanhasController'); 
const mailingsController = require('./mailingsController');
const pessoasController = require('./pessoasController');
const fluxosController = require('./fluxosController'); 
const db = require("./db");
const port = process.env.PORT;
const express = require("express");
const authenticateToken = require('./authToken');

const app = express();

app.use(express.json());

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Opcional: Enviar um alerta ou logar o erro em um serviço externo
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Opcional: Enviar um alerta ou logar o erro em um serviço externo
});

// ROTA DE TESTE API
app.get("/testeapi", (req, res) => {
    res.send("Api Rodando com sucesso");
})

// ROTAS DE LOGIN

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.loginUser(username, password); // Certifique-se de que está chamando a função correta do módulo db
        res.json(result);
    } catch (error) {
        console.error(error); // Log do erro
        res.status(401).json({ error: 'usuario ou senha incorretos' });
    }
});

// Metdos de CRUD de Usuários

app.get("/super/users/:id", authenticateToken , async (req, res) => {
    const user = await userC.selectUser(req.params.id);
    res.json(user);
});

app.get("/super/users", authenticateToken ,async (req, res) => {
    const users = await userC.selectUsers();
    res.json(users);
});

app.post("/super/users", authenticateToken ,async (req, res) => {
    await userC.insertUser(req.body);
    res.status(201);
    res.send("Usuário inserido com sucesso");
});

app.patch("/super/users/:id", authenticateToken ,async (req, res) => {
    await userC.updateUser(req.params.id, req.body);
    res.status(200);
    res.send("Usuário Alterado com sucesso");
});

app.delete("/super/users/:id", authenticateToken, async (req, res) => {
    await userC.deleteUser(req.params.id);
    res.status(204);
    res.send("Usuário Deletado com sucesso");
});

// Metodos de CRUD de Tenants

app.get("/super/tenants", authenticateToken, async (req, res) => {
    const tenants = await tenantsC.selectTenants();
    res.json(tenants);
});

app.get("/super/tenants/:id", authenticateToken, async (req, res) => {
    const tenant = await tenantsC.selectTenant(req.params.id);
    res.json(tenant);
});

app.post("/super/tenants", authenticateToken, async (req, res) => {
    await tenantsC.insertTenant(req.body);
    res.status(201).send("Tenant inserido com sucesso");
});

app.patch("/super/tenants/:id", authenticateToken, async (req, res) => {
    await tenantsC.updateTenant(req.params.id, req.body);
    res.status(200).send("Tenant alterado com sucesso");
});

app.delete("/super/tenants/:id", authenticateToken, async (req, res) => {
    await tenantsC.deleteTenant(req.params.id);
    res.status(204).send();
});

// Metodos Campanha

app.get("/admin/campanhas/:tenant_id", authenticateToken, async (req, res) => {
    const campanhas = await campanhasController.selectCampanhas(req.params.tenant_id);
    res.json(campanhas);
});

app.get("/admin/campanhas/:tenant_id/:id", authenticateToken, async (req, res) => {
    const campanha = await campanhasController.selectCampanha(req.params.tenant_id, req.params.id);
    res.json(campanha);
});

app.post("/admin/campanhas/:tenant_id", authenticateToken, async (req, res) => {
    await campanhasController.insertCampanha(req.params.tenant_id, req.body);
    res.status(201).send("Campanha inserida com sucesso");
});

app.patch("/admin/campanhas/:tenant_id/:id", authenticateToken, async (req, res) => {
    await campanhasController.updateCampanha(req.params.tenant_id, req.params.id, req.body);
    res.send("Campanha atualizada com sucesso");
});

app.delete("/admin/campanhas/:tenant_id/:id", authenticateToken, async (req, res) => {
    await campanhasController.deleteCampanha(req.params.tenant_id, req.params.id);
    res.send("Campanha deletada com sucesso");
});

// Metodos Mailing

app.get("/admin/mailings/:tenant_id", authenticateToken, async (req, res) => {
    const mailings = await mailingsController.selectMailings(req.params.tenant_id);
    res.json(mailings);
});

app.get("/admin/mailings/:tenant_id/:id", authenticateToken, async (req, res) => {
    const mailing = await mailingsController.selectMailing(req.params.tenant_id, req.params.id);
    res.json(mailing);
});

app.post("/admin/mailings/:tenant_id", authenticateToken, async (req, res) => {
    try {
        await mailingsController.insertMailing(req.params.tenant_id, req.body);
        res.status(201).send("Mailing inserido com sucesso");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.patch("/admin/mailings/:tenant_id/:id", authenticateToken, async (req, res) => {
    try {
        await mailingsController.updateMailing(req.params.tenant_id, req.params.id, req.body);
        res.send("Mailing atualizado com sucesso");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete("/admin/mailings/:tenant_id/:id", authenticateToken, async (req, res) => {
    await mailingsController.deleteMailing(req.params.tenant_id, req.params.id);
    res.send("Mailing deletado com sucesso");
});

// Rotas de Pessoas

app.get("/admin/pessoas/:mailing_id", authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const pessoas = await pessoasController.selectPessoas(req.params.mailing_id, page, limit);
    res.json(pessoas);
});

app.get("/admin/pessoas/:tenant_id/:id", authenticateToken, async (req, res) => {
    const pessoa = await pessoasController.selectPessoa(req.params.tenant_id, req.params.id);
    res.json(pessoa);
});

app.post("/admin/pessoas/:tenant_id", authenticateToken, async (req, res) => {
    try {
        await pessoasController.insertPessoa(req.params.tenant_id, req.body);
        res.status(201).send("Pessoa inserida com sucesso");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.patch("/admin/pessoas/:tenant_id/:id", authenticateToken, async (req, res) => {
    try {
        await pessoasController.updatePessoa(req.params.tenant_id, req.params.id, req.body);
        res.send("Pessoa atualizada com sucesso");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete("/admin/pessoas/:tenant_id/:id", authenticateToken, async (req, res) => {
    await pessoasController.deletePessoa(req.params.tenant_id, req.params.id);
    res.send("Pessoa deletada com sucesso");
});

// Rota de Fluxos

app.get("/fluxos", authenticateToken, async (req, res) => {
    const fluxos = await fluxosController.selectFluxos();
    res.json(fluxos);
});

// Rotas de Troncos

app.get("/admin/troncos/:tenant_id", authenticateToken, async (req, res) => {
    const troncos = await troncosController.selectTroncos(req.params.tenant_id);
    res.json(troncos);
});

app.get("/admin/troncos/:tenant_id/:id", authenticateToken, async (req, res) => {
    const tronco = await troncosController.selectTronco(req.params.tenant_id, req.params.id);
    res.json(tronco);
});

app.post("/admin/troncos/:tenant_id", authenticateToken, async (req, res) => {
    try {
        await troncosController.insertTronco(req.params.tenant_id, req.body);
        res.status(201).send("Tronco inserido com sucesso");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.patch("/admin/troncos/:tenant_id/:id", authenticateToken, async (req, res) => {
    try {
        await troncosController.updateTronco(req.params.tenant_id, req.params.id, req.body);
        res.send("Tronco atualizado com sucesso");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete("/admin/troncos/:tenant_id/:id", authenticateToken, async (req, res) => {
    await troncosController.deleteTronco(req.params.tenant_id, req.params.id);
    res.send("Tronco deletado com sucesso");
});


app.listen(port);

console.log(`Api ta rodando na porta: ${port}`);