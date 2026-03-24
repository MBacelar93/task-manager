# 📋 Task Manager - Sistema de Gestão de Tarefas

Um projeto MVC completo em Node.js + Express + SQLite para gerenciar tarefas de forma simples e eficiente.

## 🎯 Objetivo

Este projeto foi desenvolvido para aprender os conceitos fundamentais de:
- **Arquitetura MVC** (Model-View-Controller)
- **Backend** com Node.js e Express
- **Banco de Dados** com SQLite
- **Frontend** com HTML5, CSS3 e JavaScript vanilla
- **API REST** para comunicação entre frontend e backend

## 📁 Estrutura do Projeto

```
task-manager/
├── public/                  # Frontend (View)
│   ├── css/style.css       # Estilos
│   ├── js/main.js          # Lógica de interface
│   └── index.html          # Página principal
│
├── src/                    # Backend (Model + Controller)
│   ├── controllers/
│   │   └── taskController.js
│   ├── models/
│   │   └── taskModel.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── database/
│   │   └── db.js
│   └── server.js
│
├── package.json            # Configuração do projeto
└── .gitignore             # Arquivos ignorados no Git
```

## 🚀 Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
# ou
npm run dev
```

Você verá uma mensagem como:
```
╔════════════════════════════════════════╗
║   TASK MANAGER - SERVIDOR INICIADO    ║
╠════════════════════════════════════════╣
║  URL: http://localhost:3000           ║
║  Pressione Ctrl+C para parar          ║
╚════════════════════════════════════════╝
```

### 3. Abrir no navegador

Acesse: **http://localhost:3000**

## 📚 Entendendo a Arquitetura MVC

### 🎨 View (Frontend)
- **HTML** (`public/index.html`) - Estrutura da página
- **CSS** (`public/css/style.css`) - Estilo visual
- **JavaScript** (`public/js/main.js`) - Interatividade

O usuário interage com a View e envia dados para o Controller.

### 🎮 Controller (Backend - Intermediário)
- **taskController.js** - Processa requisições HTTP
- Valida dados
- Chama o Model para acessar dados
- Retorna respostas JSON

### 💾 Model (Backend - Dados)
- **taskModel.js** - Comunica com o banco de dados
- **db.js** - Configuração do SQLite
- CRUD: Create, Read, Update, Delete

## 🔄 Fluxo de uma Requisição

```
1. Usuário clica em "Adicionar Tarefa"
   ↓
2. JavaScript (main.js) envia POST para /api/tasks
   ↓
3. Express roteia para taskController.createTask()
   ↓
4. Controller valida dados
   ↓
5. Controller chama taskModel.createTask()
   ↓
6. Model insere no banco de dados (SQLite)
   ↓
7. Retorna JSON com resultado
   ↓
8. JavaScript atualiza a página
```

## 📡 Endpoints da API

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/api/tasks` | Buscar todas as tarefas |
| GET | `/api/tasks/:id` | Buscar uma tarefa |
| POST | `/api/tasks` | Criar tarefa |
| PUT | `/api/tasks/:id` | Atualizar tarefa |
| DELETE | `/api/tasks/:id` | Deletar tarefa |
| PATCH | `/api/tasks/:id/toggle` | Marcar/desmarcar concluída |

## 🎓 Conceitos Importantes

### REST API
- GET: Obter dados
- POST: Criar dados
- PUT: Atualizar dados
- DELETE: Remover dados

### Middlewares
Funções que processam requisições antes do controller:
```javascript
app.use(express.static(...))  // Servir arquivos estáticos
app.use(bodyParser.json())    // Parse JSON
```

### Callbacks vs Promises
Este projeto usa callbacks no Model (padrão do sqlite3).
Versões futuras podem usar Promises para código mais limpo.

## 🔒 Segurança

- **SQL Injection Prevention**: Uso de `?` em queries
- **XSS Prevention**: Função `escapeHtml()` no JavaScript
- **Input Validation**: Validação no Controller

## 📈 Próximas Etapas

1. Edição de tarefas (modal)
2. Categorização e priorização
3. Filtros avançados
4. Autenticação de usuários
5. Persistência melhorada

## 🛠️ Tecnologias Usadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite3** - Banco de dados
- **HTML5** - Estrutura
- **CSS3** - Estilo (com variáveis CSS)
- **JavaScript ES6+** - Lógica do frontend

## 📝 Licença

MIT

---

**Desenvolvido para aprender desenvolvimento web**
