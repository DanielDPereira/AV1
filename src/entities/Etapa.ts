import { StatusEtapa } from "../dominios/Enums";
import { Funcionario } from "./Funcionario";

export class Etapa {
  public funcionarios: Funcionario[] = [];

  constructor(
    public nome: string,
    public prazo: string,
    public status: StatusEtapa = StatusEtapa.PENDENTE
  ) {}

  iniciar(): void {
    this.status = StatusEtapa.ANDAMENTO;
  }

  finalizar(): void {
    this.status = StatusEtapa.CONCLUIDA;
  }

  associarFuncionario(f: Funcionario): void {
    if (this.funcionarios.find(func => func.id === f.id)) return;
    this.funcionarios.push(f);
  }

  listarFuncionarios(): Array<Funcionario> {
    return [...this.funcionarios];
  }
}