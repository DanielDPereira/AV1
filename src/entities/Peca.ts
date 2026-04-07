import { TipoPeca, StatusPeca } from "../dominios/Enums";
import * as fs from "fs";
import * as path from "path";

export class Peca {
  constructor(
    public nome: string,
    public tipo: TipoPeca,
    public fornecedor: string,
    public status: StatusPeca
  ) {}

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
  }

  salvar(): void {
    const dir = path.join(__dirname, "../../bd/pecas");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const arquivo = path.join(dir, `${this.nome}.json`);
    fs.writeFileSync(arquivo, JSON.stringify(this, null, 2), "utf-8");
  }

  carregar(): void {
    const arquivo = path.join(__dirname, "../../bd/pecas", `${this.nome}.json`);
    if (!fs.existsSync(arquivo)) return;
    const data = JSON.parse(fs.readFileSync(arquivo, "utf-8")) as Peca;
    this.nome = data.nome;
    this.tipo = data.tipo;
    this.fornecedor = data.fornecedor;
    this.status = data.status;
  }
}