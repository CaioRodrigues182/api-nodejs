module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log("Requisição recebida");
        res.send("Ok!");
    });

    app.delete('/pagamentos/pagamento/:id', function(req, res){
        var pagamento = {};
        var id = req.params.id;
    
        pagamento.id = id;
        pagamento.status = 'CANCELADO';
    
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);
    
        pagamentoDao.atualiza(pagamento, function(erro){
            if (erro){
              res.status(500).send(erro);
              return;
            }
            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        });
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {
        
            var pagamento = {};
            var id = req.params.id;
        
            pagamento.id = id;
            pagamento.status = 'CONFIRMADO';
        
            var connection = app.persistencia.connectionFactory();
            var pagamentoDao = new app.persistencia.PagamentoDao(connection);
        
            pagamentoDao.atualiza(pagamento, function(erro){
                if (erro){
                  res.status(500).send(erro);
                  return;
                }
                console.log('pagamento confirmado');
                res.send(pagamento);
            });
        
          });

    app.post('/pagamentos/pagamento' ,function (req, res)  {

        req.assert("forma_de_pagamento", "forma de pagamento é obrigatorio").notEmpty();
        req.assert("valor", "o valor é obrigatorio e deve ser um decimal").notEmpty().isFloat();

        var erros = req.validationErrors();

        if(erros){
            console.log("Erros de validação encontrados");
            res.status(400).send(erros);
            return;
        }

        var pagamento = req.body;
        console.log("Processando uma requisição de um novo pagamento");

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function(erro, resultado){
            if(erro){
                console.log("Erro ao inserir no banco: " + erro);
                res.status(500).send(erro);
            }else {
                console.log('pagamento criado');
                res.location('pagamentos/pagamento/' + resultado.insertId);
                res.status(201).json(pagamento);
            }  
        });
    });

}
