import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { FrotaRepo } from "../services/FrotaRepo";
import { EquipeRepo } from "../services/EquipeRepo";
import { Funcionario } from "../entities/Funcionario";
import { Aeronave } from "../entities/Aeronave";
import { Peca } from "../entities/Peca";
import { Etapa } from "../entities/Etapa";
import { Teste } from "../entities/Teste";
import { Relatorio } from "../entities/Relatorio";
import * as Tipos from "../dominios/Enums";

export class SistemaCLI {
  private rl = readline.createInterface({ input, output });
  private repoFrota = new FrotaRepo();
  private repoEquipe = new EquipeRepo();
  private userLogado!: Funcionario;

  async iniciar() {
    console.clear();
    console.log("=== AEROCODE SYSTEM ===");
    
    let autenticado = false;
    while (!autenticado) {
      const u = await this.rl.question("Login: ");
      const s = await this.rl.question("Senha: ");
      const func = this.repoEquipe.fazerLogin(u, s);
      
      if (func) {
        this.userLogado = func;
        autenticado = true;
      } else {
        console.log("[ERRO] Credenciais inválidas.\n");
      }
    }

    await this.loopPrincipal();
  }

  private async loopPrincipal() {
    let rodando = true;
    while (rodando) {
      console.log(`\n--- MENU PRINCIPAL (${this.userLogado.nivelPermissao}) ---`);
      console.log("1. Cadastrar nova Aeronave");
      console.log("2. Ver Frota");
      console.log("3. Adicionar Peça a uma Aeronave");
      console.log("4. Mudar status de Peça");
      console.log("5. Gerenciamento de Etapas");
      console.log("6. Lançar Teste de Qualidade");
      console.log("7. Gerar Relatório de Entrega");
      if (this.userLogado.nivelPermissao === Tipos.NivelPermissao.ADMINISTRADOR) {
        console.log("8. Controle de Colaboradores");
      }
      console.log("0. Encerrar Sessão");

      const opt = await this.rl.question("\nOpção desejada: ");

      switch (opt) {
        case "1": await this.uiCadastrarAeronave(); break;
        case "2": this.uiListarFrota(); break;
        case "3": await this.uiAdicionarPeca(); break;
        case "4": await this.uiAtualizarPeca(); break;
        case "5": await this.uiEtapas(); break;
        case "6": await this.uiRegistrarTeste(); break;
        case "7": await this.uiRelatorio(); break;
        case "8": 
          if (this.userLogado.nivelPermissao === Tipos.NivelPermissao.ADMINISTRADOR) {
            await this.uiFuncionarios(); 
          } else {
            console.log("[!] Sem permissão.");
          }
          break;
        case "0": 
          console.log("Deslogando... Até logo!");
          rodando = false;
          this.rl.close();
          break;
        case "1914":
          console.log("Ano em que nasceu Paysandu Sport Club: O Maior Campeão da Amazônia!");
          break;
        default: console.log("[!] Opção não reconhecida.");
      }
    }
  }

  private async uiCadastrarAeronave() {
    const cod = await this.rl.question("Informe o código único: ");
    const mod = await this.rl.question("Modelo: ");
    const cap = Number(await this.rl.question("Capacidade de Passageiros: "));
    const alc = Number(await this.rl.question("Alcance em Km: "));
    
    console.log("1- Comercial | 2- Militar");
    const tStr = await this.rl.question("Tipo: ");
    const tipo = tStr === "2" ? Tipos.TipoAeronave.MILITAR : Tipos.TipoAeronave.COMERCIAL;

    const aero = new Aeronave(cod, mod, tipo, cap, alc);
    if (this.repoFrota.inserir(aero)) {
      console.log("[OK] Aeronave registrada no sistema.");
    } else {
      console.log("[ERRO] Código já existente.");
    }
  }

  private uiListarFrota() {
    const frota = this.repoFrota.listarTodos();
    if (frota.length === 0) return console.log("Nenhuma aeronave na base.");
    frota.forEach(a => a.detalhes());
  }

  private async uiAdicionarPeca() {
    const cod = await this.rl.question("Código da Aeronave alvo: ");
    const aero = this.repoFrota.buscar(cod);
    if (!aero) return console.log("[ERRO] Aeronave não encontrada.");

    const nome = await this.rl.question("Nome do componente: ");
    const forn = await this.rl.question("Empresa fornecedora: ");
    
    console.log("1- Nacional | 2- Importada");
    const tipo = (await this.rl.question("Origem: ")) === "2" ? Tipos.TipoPeca.IMPORTADA : Tipos.TipoPeca.NACIONAL;

    aero.pecas.push(new Peca(nome, tipo, forn, Tipos.StatusPeca.EM_PRODUCAO));
    this.repoFrota.persistir();
    console.log("[OK] Peça atrelada com sucesso.");
  }

  private async uiAtualizarPeca() {
    const cod = await this.rl.question("Código da Aeronave: ");
    const aero = this.repoFrota.buscar(cod);
    if (!aero || aero.pecas.length === 0) return console.log("[ERRO] Aeronave inválida ou sem peças.");

    aero.pecas.forEach((p, i) => console.log(`${i}. ${p.nome} - [${p.status}]`));
    const idx = Number(await this.rl.question("ID da peça para atualizar: "));
    
    if (!aero.pecas[idx]) return console.log("[ERRO] ID inválido.");

    console.log("1- Em Produção | 2- Em Transporte | 3- Pronta");
    const s = await this.rl.question("Novo status: ");
    let novoStatus = Tipos.StatusPeca.EM_PRODUCAO;
    if (s === "2") novoStatus = Tipos.StatusPeca.EM_TRANSPORTE;
    if (s === "3") novoStatus = Tipos.StatusPeca.PRONTA;

    aero.pecas[idx].atualizarStatus(novoStatus);
    this.repoFrota.persistir();
    console.log("[OK] Atualizado.");
  }

  private async uiEtapas() {
    console.log("\n[ ETAPAS ] 1. Criar | 2. Avançar Status | 3. Alocar Funcionario");
    const op = await this.rl.question("Sua escolha: ");
    
    const cod = await this.rl.question("Código Aeronave: ");
    const aero = this.repoFrota.buscar(cod);
    if (!aero) return console.log("[ERRO] Não encontrada.");

    if (op === "1") {
      const nome = await this.rl.question("Nome da etapa: ");
      const prazo = await this.rl.question("Prazo: ");
      aero.etapas.push(new Etapa(nome, prazo));
      console.log("[OK] Etapa criada.");
    } 
    else if (op === "2") {
      aero.etapas.forEach((e, i) => console.log(`${i}. ${e.nome} - [${e.status}]`));
      const idx = Number(await this.rl.question("ID da etapa: "));
      if (!aero.etapas[idx]) return;

      const etapaAtual = aero.etapas[idx];
      
        const etapaAnterior = idx > 0 ? aero.etapas[idx - 1] : undefined;
        if (etapaAnterior && etapaAnterior.status !== Tipos.StatusEtapa.CONCLUIDA) {
          return console.log("[ERRO] A etapa anterior precisa estar concluída primeiro!");
      }

      if (etapaAtual.status === Tipos.StatusEtapa.PENDENTE) etapaAtual.iniciar();
      else if (etapaAtual.status === Tipos.StatusEtapa.ANDAMENTO) etapaAtual.finalizar();
      
      console.log(`[OK] Status evoluiu para: ${etapaAtual.status}`);
    }
    else if (op === "3") {
      aero.etapas.forEach((e, i) => console.log(`${i}. ${e.nome}`));
      const idx = Number(await this.rl.question("ID da etapa: "));
      if (!aero.etapas[idx]) return;

      this.repoEquipe.listar().forEach(f => console.log(`ID: ${f.id} | ${f.nome}`));
      const fId = await this.rl.question("ID Funcionario: ");
      const func = this.repoEquipe.buscarPorId(fId);

      if (!func) return console.log("[ERRO] ID inválido.");

      const totalAntes = aero.etapas[idx].listarFuncionarios().length;
      aero.etapas[idx].associarFuncionario(func);
      const totalDepois = aero.etapas[idx].listarFuncionarios().length;
      if (totalDepois > totalAntes) console.log("[OK] Funcionario alocado.");
      else console.log("[ERRO] Falha ao alocar (já está na etapa ou ID inválido).");
    }
    this.repoFrota.persistir();
  }

  private async uiRegistrarTeste() {
    const cod = await this.rl.question("Código da Aeronave: ");
    const aero = this.repoFrota.buscar(cod);
    if (!aero) return console.log("[ERRO] Aeronave não encontrada.");

    console.log("1- Elétrico | 2- Hidráulico | 3- Aerodinâmico");
    const t = await this.rl.question("Tipo: ");
    let tipo = Tipos.TipoTeste.ELETRICO;
    if (t === "2") tipo = Tipos.TipoTeste.HIDRAULICO;
    if (t === "3") tipo = Tipos.TipoTeste.AERODINAMICO;

    const r = await this.rl.question("Aprovado? (s/n): ");
    const result = r.toLowerCase() === 's' ? Tipos.ResultadoTeste.APROVADO : Tipos.ResultadoTeste.REPROVADO;

    aero.testes.push(new Teste(tipo, result));
    this.repoFrota.persistir();
    console.log("[OK] Teste salvo.");
  }

  private async uiRelatorio() {
    const cod = await this.rl.question("Código da Aeronave: ");
    const aero = this.repoFrota.buscar(cod);
    if (!aero) return console.log("[ERRO] Aeronave não encontrada.");

    const rel = new Relatorio();
    rel.gerarRelatorio(aero);

    const s = await this.rl.question("Deseja gerar o .txt em disco? (s/n): ");
    if (s.toLowerCase() === 's') {
      rel.salvarEmArquivo();
    }
  }

  private async uiFuncionarios() {
    console.log("\n[ EQUIPE ] 1. Cadastrar | 2. Listar");
    const op = await this.rl.question("Opção: ");
    
    if (op === "1") {
      const n = await this.rl.question("Nome: ");
      const t = await this.rl.question("Tel: ");
      const e = await this.rl.question("Endereço: ");
      const u = await this.rl.question("Login: ");
      const s = await this.rl.question("Senha: ");
      
      console.log("Permissão: 1- Operador | 2- Engenheiro | 3- Admin");
      const p = await this.rl.question("Escolha: ");
      let perm = Tipos.NivelPermissao.OPERADOR;
      if (p === "2") perm = Tipos.NivelPermissao.ENGENHEIRO;
      if (p === "3") perm = Tipos.NivelPermissao.ADMINISTRADOR;

      const f = new Funcionario("", n, t, e, u, s, perm);
      if (this.repoEquipe.adicionar(f)) console.log("[OK] Cadastrado.");
      else console.log("[ERRO] Usuário já em uso.");
    } 
    else if (op === "2") {
      this.repoEquipe.listar().forEach(f => {
        console.log(`[${f.id}] ${f.nome} - Cargo: ${f.nivelPermissao} - Login: ${f.usuario}`);
      });
    }
  }
}