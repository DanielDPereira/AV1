import { TipoAeronave } from "../dominios/Enums";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";
import { Funcionario } from "./Funcionario";
import * as fs from "fs";
import * as path from "path";

export class Aeronave {
  public pecas: Peca[] = [];
  public etapas: Etapa[] = [];
  public testes: Teste[] = [];

  constructor(
    public codigo: string,
    public modelo: string,
    public tipo: TipoAeronave,
    public capacidade: number,
    public alcance: number
  ) {}

  private montarDetalhes(): string {
    let output = `\n--- AERONAVE [${this.codigo}] ---\n`;
    output += `Modelo: ${this.modelo} | Tipo: ${this.tipo} | Capacidade: ${this.capacidade} | Alcance: ${this.alcance}km\n`;
    
    output += `\n>> PEÇAS (${this.pecas.length}):\n`;
    this.pecas.forEach(p => output += ` - ${p.nome} (${p.status})\n`);

    output += `\n>> ETAPAS (${this.etapas.length}):\n`;
    this.etapas.forEach((e, i) => output += ` ${i + 1}. ${e.nome} - ${e.status}\n`);

    output += `\n>> TESTES (${this.testes.length}):\n`;
    this.testes.forEach(t => output += ` - ${t.tipo}: ${t.resultado}\n`);

    return output;
  }

  detalhes(): void {
    console.log(this.montarDetalhes());
  }

  salvar(): void {
    const dir = path.join(__dirname, "../../bd/aeronaves");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const arquivo = path.join(dir, `${this.codigo}.json`);
    fs.writeFileSync(arquivo, JSON.stringify(this, null, 2), "utf-8");
  }

  carregar(): void {
    const arquivo = path.join(__dirname, "../../bd/aeronaves", `${this.codigo}.json`);
    if (!fs.existsSync(arquivo)) return;

    const data = JSON.parse(fs.readFileSync(arquivo, "utf-8")) as Aeronave;
    this.modelo = data.modelo;
    this.tipo = data.tipo;
    this.capacidade = data.capacidade;
    this.alcance = data.alcance;
    this.pecas = (data.pecas || []).map(p => new Peca(p.nome, p.tipo, p.fornecedor, p.status));
    this.etapas = (data.etapas || []).map(e => {
      const etapa = new Etapa(e.nome, e.prazo, e.status);
      etapa.funcionarios = (e.funcionarios || []).map(
        f => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao)
      );
      return etapa;
    });
    this.testes = (data.testes || []).map(t => new Teste(t.tipo, t.resultado));
  }
}