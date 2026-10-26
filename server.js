
const express = require('express');
const conexao = require('./database');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de produtos funcionando!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await conexao.query(
            'SELECT 1 AS conectado'
        );

        res.json({
            mensagem: 'Conexão com MySQL funcionando!',
            resultado: resultado[0]
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao conectar com o MySQL'
        });
    }
});



app.post('/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque } = req.body;

        const sql = `
            INSERT INTO produtos (nome, descricao, preco, estoque)
            VALUES (?, ?, ?, ?)
        `;

        const [resultado] = await conexao.execute(sql, [
            nome,
            descricao || null,
            preco,
            estoque
        ]);

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso!',
            id: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar produto'
        });
    }
});



app.get('/produtos', async (req, res) => {
    try {
        const [produtos] = await conexao.query(
            'SELECT * FROM produtos'
        );

        res.status(200).json(produtos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar produtos'
        });
    }
});


app.put('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, estoque } = req.body;

        const sql = `
            UPDATE produtos
            SET nome = ?, descricao = ?, preco = ?, estoque = ?
            WHERE id = ?
        `;

        const [resultado] = await conexao.execute(sql, [
            nome,
            descricao || null,
            preco,
            estoque,
            id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Produto atualizado com sucesso!'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar produto'
        });
    }
});



app.delete('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexao.execute(
            'DELETE FROM produtos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Produto excluído com sucesso!'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao excluir produto'
        });
    }
});

