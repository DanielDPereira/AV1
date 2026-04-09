# ✈️ Aerocode - Sistema de Gestão de Produção de Aeronaves

Bem-vindo ao repositório do **Aerocode**, um sistema do tipo Command-Line Interface (CLI) desenvolvido para simular e gerenciar o complexo processo de produção de aeronaves, desde o cadastro inicial até a entrega final ao cliente.

Este projeto foi construído como o Produto Mínimo Viável (MVP) de uma empresa fictícia de software voltada para a indústria aeroespacial.

---

## 🎓 Sobre o Projeto Acadêmico

Este software foi desenvolvido como a Atividade de Avaliação Individual 1 (AV1) para a disciplina de **Programação Orientada a Objetos (POO)** no curso de ADS.

* **Instituição:** FATEC São José dos Campos
* **Estudante:** Daniel Dias Pereira
* **Professor:** Eng. Dr. Gerson Penha

---

## 🚀 Funcionalidades Principais

O sistema foi arquitetado para atender aos requisitos de gestão de chão de fábrica e controle de qualidade, contemplando:

* **Gestão de Aeronaves:** Cadastro de aeronaves civis e militares contendo código único, modelo, capacidade de passageiros e alcance.
* **Controle de Peças:** Associação de componentes às aeronaves, definindo sua origem (nacional/importada), fornecedor e acompanhamento de status (em produção, em transporte, pronta).
* **Gerenciamento de Etapas:** Criação de um fluxo lógico de produção. As etapas (pendente, em andamento, concluída) não podem avançar sem que as anteriores sejam finalizadas.
* **Controle de Colaboradores e Acesso:** Sistema completo de login com autenticação de senhas criptografadas* (utilizando `scrypt`). Permite o cadastro de funcionários (Administrador, Engenheiro, Operador) e sua alocação em etapas específicas da produção.
* **Avaliação de Qualidade (Testes):** Registro de testes elétricos, hidráulicos e aerodinâmicos, classificando os resultados entre aprovados ou reprovados.
* **Geração de Relatórios:** Exportação de um relatório final de entrega (em formato `.txt`) detalhando o histórico de produção, peças, testes e dados técnicos da aeronave.
* **Persistência de Dados em Arquivos:** Todo o banco de dados do sistema opera via manipulação de arquivos `.json`, garantindo que informações da frota, peças, equipe e relatórios fiquem salvas localmente após o encerramento do programa.

* * (criptografia: feature extra, adicionada por mim, mas não sendo requisito do projeto)

---

## 💻 Tecnologias Utilizadas

* **Linguagem:** TypeScript
* **Ambiente de Execução:** Node.js
* **Criptografia:** Módulo nativo `crypto` do Node.js
* **Manipulação de Arquivos:** Módulo nativo `fs` (File System) para leitura/escrita de JSONs e TXTs.

---

## ⚙️ Pré-requisitos e Instalação

Para rodar este projeto na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) instalado.

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/DanielDPereira/AV1.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd AV1
   ```

3. **Instale as dependências necessárias:**
   ```bash
   npm install
   ```
   *(Nota: O projeto utiliza `ts-node` para execução em ambiente de desenvolvimento e `typescript` para a compilação).*

---

## 🕹️ Como Utilizar o Sistema

Você pode iniciar o sistema de duas maneiras diferentes.

**Modo de Desenvolvimento (Executa o TypeScript diretamente):**
```bash
npm run dev
```

**Modo de Produção (Compila para JavaScript e executa):**
```bash
npm run build
npm start
```

### 🔐 Acesso Inicial

Ao rodar a aplicação pela primeira vez, o sistema irá gerar o banco de dados automaticamente. Para acessar o painel principal, utilize as credenciais padrão de Administrador:

* **Login:** `admin`
* **Senha:** `admin`

*Também existe um usuário pré-configurado de nível Engenheiro com o login `daniel`, caso já conste na base.*

---

## 🗂️ Estrutura de Diretórios e Arquivos

Abaixo está o detalhamento completo da arquitetura do projeto e seus respectivos arquivos:

```text
📦 AV1
 ┣ 📂 bd                         # Diretório gerado para persistência de dados
 ┃ ┗ 📜 equipe.json              # Arquivo JSON que armazena os dados de login dos funcionários
 ┣ 📂 src                        # Código-fonte principal da aplicação
 ┃ ┣ 📂 dominios
 ┃ ┃ ┗ 📜 Enums.ts               # Define as enumerações padronizadas (Tipos, Níveis de Permissão, Status)
 ┃ ┣ 📂 entities                 # Classes que representam as entidades de negócio
 ┃ ┃ ┣ 📜 Aeronave.ts            # Classe e regras de negócio da Aeronave
 ┃ ┃ ┣ 📜 Etapa.ts               # Classe para gerenciamento das etapas de produção
 ┃ ┃ ┣ 📜 Funcionario.ts         # Entidade de colaborador com métodos de hash de senha
 ┃ ┃ ┣ 📜 Peca.ts                # Entidade de componentes da aeronave
 ┃ ┃ ┣ 📜 Relatorio.ts           # Classe responsável por estruturar e exportar o TXT final
 ┃ ┃ ┗ 📜 Teste.ts               # Entidade para registro de testes de qualidade
 ┃ ┣ 📂 services                 # Camada de serviços e repositórios de acesso a dados
 ┃ ┃ ┣ 📜 BaseDeDados.ts         # Utilitário estático para leitura e escrita em JSON utilizando 'fs'
 ┃ ┃ ┣ 📜 EquipeRepo.ts          # Repositório de manipulação do array de funcionários e autenticação
 ┃ ┃ ┗ 📜 FrotaRepo.ts           # Repositório de gerenciamento da frota de aeronaves
 ┃ ┣ 📂 ui                       # Camada de interface de usuário (CLI)
 ┃ ┃ ┗ 📜 SistemaCLI.ts          # Lógica do menu interativo no terminal utilizando 'readline'
 ┃ ┗ 📜 index.ts                 # Ponto de entrada (entry point) que inicializa o sistema
 ┣ 📜 .gitignore                 # Arquivos e pastas ignorados pelo Git (como node_modules, build, etc.)
 ┣ 📜 AV1.pdf                    # Documento em PDF com os requisitos e instruções do projeto acadêmico
 ┣ 📜 package-lock.json          # Árvore de dependências travada para garantir versões exatas
 ┣ 📜 package.json               # Configurações do projeto Node, scripts e dependências
 ┗ 📜 tsconfig.json              # Configurações de compilação do TypeScript
```
