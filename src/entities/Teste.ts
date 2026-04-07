import { TipoTeste, ResultadoTeste } from "../dominios/Enums";
import * as fs from "fs";
import * as path from "path";

export class Teste {
  constructor(
    public tipo: TipoTeste,
    public resultado: ResultadoTeste
  ) {}

  salvar(): void {
    const dir = path.join(__dirname, "../../bd/testes");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const arquivo = path.join(dir, `${this.tipo}.json`);
    fs.writeFileSync(arquivo, JSON.stringify(this, null, 2), "utf-8");
  }

  carregar(): void {
    const arquivo = path.join(__dirname, "../../bd/testes", `${this.tipo}.json`);
    if (!fs.existsSync(arquivo)) return;
    const data = JSON.parse(fs.readFileSync(arquivo, "utf-8")) as Teste;
    this.tipo = data.tipo;
    this.resultado = data.resultado;
  }
}