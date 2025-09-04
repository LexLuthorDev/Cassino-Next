# Modal de Depósito - Documentação de Uso

## Visão Geral
O componente `ModalDeposito` foi criado seguindo o padrão visual do projeto Cassino-Next, mantendo a consistência com os outros modais existentes.

## Características do Modal

### Design Visual
- **Background**: Gradiente escuro com efeito de blur e elementos decorativos
- **Cores**: Segue o tema do cassino (verde para elementos ativos, cinza para inativos)
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Animações**: Transições suaves e efeitos hover

### Funcionalidades
- Seleção entre PIX e Cartão de Crédito
- Campo de input para valor personalizado
- Opções pré-definidas com bônus (R$ 30, R$ 50, R$ 80)
- Validação de valor mínimo (R$ 1,00)
- Botão de depósito desabilitado até valor válido

## Como Usar

### 1. Importar o Componente
```jsx
import ModalDeposito from "@/components/ModalDeposito";
```

### 2. Adicionar Estado para Controle
```jsx
const [mostrarModalDeposito, setMostrarModalDeposito] = useState(false);
```

### 3. Função para Lidar com o Depósito
```jsx
const handleDepositar = (dadosDeposito) => {
  console.log("Valor:", dadosDeposito.valor);
  console.log("Método:", dadosDeposito.metodo);
  
  // Implementar lógica de depósito aqui
  // Ex: chamar API, redirecionar para gateway, etc.
};
```

### 4. Renderizar o Modal
```jsx
<ModalDeposito
  visible={mostrarModalDeposito}
  onClose={() => setMostrarModalDeposito(false)}
  onDepositar={handleDepositar}
/>
```

### 5. Botão para Abrir o Modal
```jsx
<button onClick={() => setMostrarModalDeposito(true)}>
  Depositar
</button>
```

## Props do Componente

| Prop | Tipo | Descrição |
|------|------|-----------|
| `visible` | boolean | Controla a visibilidade do modal |
| `onClose` | function | Função chamada quando o modal é fechado |
| `onDepositar` | function | Função chamada quando o depósito é confirmado |

## Estrutura de Dados do Depósito

Quando `onDepositar` é chamado, recebe um objeto com:
```jsx
{
  valor: number,        // Valor do depósito (ex: 30.00)
  metodo: string        // Método selecionado ("pix" ou "cartao")
}
```

## Integração com o Sistema de Temas

O modal utiliza automaticamente as cores do tema do cassino através do contexto `ConfigCassinoContext`:
- `tema.cor_primaria` - Cor principal
- `tema.cor_secundaria` - Cor secundária
- `tema.cor_tercearia` - Cor terciária
- `tema.bg_card` - Background dos cards

## Exemplo Completo de Implementação

```jsx
"use client";

import { useState } from "react";
import ModalDeposito from "@/components/ModalDeposito";

export default function MinhaPagina() {
  const [mostrarModalDeposito, setMostrarModalDeposito] = useState(false);

  const handleDepositar = (dadosDeposito) => {
    // Aqui você implementa a lógica de depósito
    console.log("Processando depósito:", dadosDeposito);
    
    // Exemplo: redirecionar para gateway de pagamento
    // window.location.href = `/pagamento?valor=${dadosDeposito.valor}&metodo=${dadosDeposito.metodo}`;
  };

  return (
    <div>
      <button 
        onClick={() => setMostrarModalDeposito(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Fazer Depósito
      </button>

      <ModalDeposito
        visible={mostrarModalDeposito}
        onClose={() => setMostrarModalDeposito(false)}
        onDepositar={handleDepositar}
      />
    </div>
  );
}
```

## Personalizações Possíveis

### Alterar Valores das Opções
Edite o array `opcoesDeposito` no componente:
```jsx
const opcoesDeposito = [
  { valor: 25, bonus: 25 },
  { valor: 100, bonus: 100 },
  { valor: 200, bonus: 200 },
];
```

### Adicionar Novos Métodos de Pagamento
Adicione novos botões na seção de seleção de método e atualize o estado `metodoPagamento`.

### Modificar Validações
Altere a função `handleDepositar` para incluir validações adicionais (ex: limite máximo, verificação de saldo, etc.).

## Dependências

- React 18+
- Lucide React (para ícones)
- Tailwind CSS (para estilos)
- Contexto ConfigCassinoContext (para tema)
- Componentes UI: Button, Input
