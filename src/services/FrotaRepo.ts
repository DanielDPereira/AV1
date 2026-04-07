import { Aeronave } from "../entities/Aeronave";
import { BaseDeDados } from "./BaseDeDados";
import { Peca } from "../entities/Peca";
import { Etapa } from "../entities/Etapa";
import { Teste } from "../entities/Teste";
import { Funcionario } from "../entities/Funcionario";

export class FrotaRepo {
  private frota: Aeronave[] = [];
  private readonly ARQUIVO = "frota.json";

  constructor() {
    this.carregarDados();
  }

  inserir(aeronave: Aeronave): boolean {
    if (this.buscar(aeronave.codigo)) return false;
    this.frota.push(aeronave);
    this.persistir();
    return true;
  }

  buscar(codigo: string): Aeronave | undefined {
    return this.frota.find(a => a.codigo === codigo);
  }

  listarTodos(): Aeronave[] {
    return this.frota;
  }

  persistir() {
    BaseDeDados.salvarJSON(this.ARQUIVO, this.frota);
  }

  private carregarDados() {
    const rawData = BaseDeDados.lerJSON(this.ARQUIVO);
    this.frota = rawData.map(obj => {
      const aero = new Aeronave(obj.codigo, obj.modelo, obj.tipo, obj.capacidade, obj.alcance);
      aero.pecas = (obj.pecas || []).map((p: any) => new Peca(p.nome, p.tipo, p.fornecedor, p.status));
      aero.etapas = (obj.etapas || []).map((e: any) => {
        const etapa = new Etapa(e.nome, e.prazo, e.status);
        etapa.funcionarios = (e.funcionarios || []).map(
          (f: any) => new Funcionario(String(f.id), f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao)
        );
        return etapa;
      });
      aero.testes = (obj.testes || []).map((t: any) => new Teste(t.tipo, t.resultado));
      return aero;
    });
  }
}