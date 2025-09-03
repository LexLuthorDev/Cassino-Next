# Integração do Modal de Depósito com o Backend

## Visão Geral
Este documento explica como o modal de depósito do frontend se integra com o backend para processar depósitos de jogadores.

## Arquitetura Implementada

### Backend (API-Saas-Cassino-loadbalancer)

#### 1. Repository Layer (`/api/repositories/deposito.repository.js`)
- **Responsabilidade**: Acesso direto ao banco de dados
- **Métodos principais**:
  - `create()` - Criar novo depósito
  - `findById()` - Buscar depósito por ID
  - `findAllWithFilters()` - Listar com filtros e paginação
  - `update()` - Atualizar depósito
  - `aprovarDeposito()` - Aprovar depósito com transação
  - `rejeitarDeposito()` - Rejeitar depósito
  - `delete()` - Deletar depósito
  - `getStats()` - Estatísticas

#### 2. Service Layer (`/api/services/deposito.service.js`)
- **Responsabilidade**: Lógica de negócio
- **Métodos principais**:
  - `criarDepositoFrontend()` - Criar depósito do frontend
  - `buscarDepositosJogador()` - Buscar depósitos do jogador
  - `getStatsJogador()` - Estatísticas do jogador
  - Métodos administrativos (aprovar, rejeitar, etc.)

#### 3. Controller Layer (`/api/controllers/deposito.controller.js`)
- **Responsabilidade**: Controle de requisições HTTP
- **Endpoints principais**:
  - `POST /api/deposito/frontend` - Criar depósito do frontend
  - `POST /api/deposito` - Criar depósito administrativo
  - `GET /api/deposito` - Listar depósitos
  - `PUT /api/deposito/:id` - Atualizar depósito
  - `POST /api/deposito/:id/aprovar` - Aprovar depósito
  - `POST /api/deposito/:id/rejeitar` - Rejeitar depósito

#### 4. Routes (`/api/routes/deposito.routes.js`)
- **Configuração**: Rotas protegidas por autenticação
- **Middleware**: `autenticarCookie` para todas as rotas

### Frontend (Cassino-Next)

#### 1. API Client (`/src/api/deposito.js`)
- **Responsabilidade**: Comunicação com o backend
- **Métodos principais**:
  - `criarDeposito()` - POST para `/api/deposito/frontend`
  - `buscarDepositosJogador()` - GET para `/api/deposito`
  - `buscarDeposito()` - GET para `/api/deposito/:id`
  - Métodos administrativos

#### 2. Modal Component (`/src/components/ModalDeposito.jsx`)
- **Responsabilidade**: Interface do usuário
- **Funcionalidades**:
  - Seleção de método de pagamento (PIX/Cartão)
  - Input de valor personalizado
  - Opções pré-definidas com bônus
  - Validação de valor mínimo (R$ 25,00)

#### 3. Header Integration (`/src/components/home/Header.jsx`)
- **Responsabilidade**: Integração do modal com a aplicação
- **Funcionalidades**:
  - Estado do modal
  - Função `handleDepositar()` que chama a API
  - Recarregamento de dados após sucesso

## Fluxo de Depósito

### 1. Usuário Abre o Modal
```jsx
// No Header.jsx
<button onClick={() => setMostrarModalDeposito(true)}>
  Depositar
</button>
```

### 2. Usuário Preenche os Dados
- Seleciona método de pagamento (PIX ou Cartão)
- Insere valor ou seleciona opção pré-definida
- Clica em "Depositar"

### 3. Validação Frontend
```jsx
// No ModalDeposito.jsx
const handleDepositar = () => {
  const valor = parseFloat(valorDeposito);
  if (valor >= 25) {
    onDepositar({ valor, metodo: metodoPagamento });
    onClose();
  }
};
```

### 4. Chamada da API
```jsx
// No Header.jsx
const response = await depositoAPI.criarDeposito(dadosDeposito);
```

### 5. Processamento Backend
```javascript
// No deposito.controller.js
const deposito = await depositoService.criarDepositoFrontend(
  { valor, metodo }, 
  usuarioId
);
```

### 6. Criação no Banco
```javascript
// No deposito.repository.js
const deposito = await Deposito.create(dadosDeposito);
```

### 7. Resposta para o Frontend
```json
{
  "success": true,
  "data": {
    "id": 123,
    "valor": 50.00,
    "metodo_pagamento": "pix",
    "status": "pendente",
    "created_at": "2025-09-03T..."
  },
  "message": "Depósito criado com sucesso! Aguarde a aprovação."
}
```

## Validações Implementadas

### Frontend
- **Valor mínimo**: R$ 25,00
- **Métodos válidos**: PIX, Cartão de Crédito
- **Campos obrigatórios**: valor, metodo

### Backend
- **Validação de usuário**: Deve estar autenticado
- **Validação de jogador**: Deve existir e pertencer ao cassino
- **Validação de valor**: Mínimo R$ 25,00
- **Validação de método**: PIX ou cartão

## Estados do Depósito

1. **pendente** - Depósito criado, aguardando aprovação
2. **aprovado** - Depósito aprovado, saldo adicionado ao jogador
3. **rejeitado** - Depósito rejeitado
4. **cancelado** - Depósito cancelado

## Segurança

### Autenticação
- Todas as rotas requerem autenticação via cookie
- Middleware `autenticarCookie` valida a sessão

### Autorização
- Jogadores só podem criar depósitos para si mesmos
- Admins/Cassinos podem gerenciar todos os depósitos
- Validação de permissões em cada operação

### Validação de Dados
- Sanitização de inputs
- Validação de tipos e formatos
- Proteção contra SQL injection (Sequelize ORM)

## Próximos Passos para Integração com Gateway de Pagamento

### 1. Modificar o Repository
```javascript
// Adicionar campos para integração
{
  gateway_id: DataTypes.STRING,        // ID do gateway
  gateway_status: DataTypes.STRING,    // Status do gateway
  gateway_response: DataTypes.TEXT,    // Resposta completa do gateway
  payment_url: DataTypes.STRING,       // URL para pagamento
  expires_at: DataTypes.DATE           // Expiração do pagamento
}
```

### 2. Modificar o Service
```javascript
// Integrar com gateway
async criarDepositoComGateway(depositoData, usuarioId) {
  // 1. Criar depósito no banco
  const deposito = await this.criarDepositoFrontend(depositoData, usuarioId);
  
  // 2. Chamar gateway de pagamento
  const gatewayResponse = await gatewayService.criarPagamento({
    valor: deposito.valor,
    metodo: deposito.metodo_pagamento,
    referencia: deposito.id
  });
  
  // 3. Atualizar depósito com dados do gateway
  await this.atualizar(deposito.id, {
    gateway_id: gatewayResponse.id,
    payment_url: gatewayResponse.payment_url,
    expires_at: gatewayResponse.expires_at
  });
  
  return gatewayResponse;
}
```

### 3. Modificar o Controller
```javascript
// Endpoint para criar depósito com gateway
async criarDepositoComGateway(req, res) {
  try {
    const { valor, metodo } = req.body;
    const usuarioId = req.usuario.id;
    
    const resultado = await depositoService.criarDepositoComGateway(
      { valor, metodo }, 
      usuarioId
    );
    
    res.json({
      success: true,
      data: resultado,
      message: "Depósito criado. Redirecione para o pagamento."
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

## Testes

### Testar Criação de Depósito
```bash
# Backend rodando
curl -X POST http://localhost:3000/api/deposito/frontend \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"valor": 50, "metodo": "pix"}'
```

### Testar Listagem
```bash
curl http://localhost:3000/api/deposito \
  -H "Cookie: session=..."
```

## Monitoramento e Logs

### Logs Implementados
- Criação de depósitos
- Aprovações/rejeições
- Erros de validação
- Erros de sistema

### Métricas Disponíveis
- Total de depósitos por status
- Valor total aprovado
- Tempo médio de aprovação
- Taxa de sucesso

## Conclusão

A integração está completa e funcional para o fluxo básico de depósitos. O sistema está preparado para futuras integrações com gateways de pagamento reais, mantendo a arquitetura limpa e extensível.

### Arquivos Criados/Modificados
- ✅ `deposito.repository.js` - Novo repository
- ✅ `deposito.service.js` - Atualizado com novos métodos
- ✅ `deposito.controller.js` - Novo método para frontend
- ✅ `deposito.routes.js` - Nova rota para frontend
- ✅ `deposito.js` - API client no frontend
- ✅ `Header.jsx` - Integração com API
- ✅ `ModalDeposito.jsx` - Modal responsivo e funcional
