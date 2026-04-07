import { NivelPermissao } from "../dominios/Enums";
import * as fs from "fs";
import * as path from "path";

export class Funcionario {
  constructor(
    public id: string,
    public nome: string,
    public telefone: string,
    public endereco: string,
    public usuario: string,
    public senha: string,
    public nivelPermissao: NivelPermissao
  ) {}

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  salvar(): void {
    const dir = path.join(__dirname, "../../bd/funcionarios");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const nome = this.id || this.usuario;
    const arquivo = path.join(dir, `${nome}.json`);
    fs.writeFileSync(arquivo, JSON.stringify(this, null, 2), "utf-8");
  }

  carregar(): void {
    const dir = path.join(__dirname, "../../bd/funcionarios");
    const nome = this.id || this.usuario;
    const arquivo = path.join(dir, `${nome}.json`);
    if (!fs.existsSync(arquivo)) return;
    const data = JSON.parse(fs.readFileSync(arquivo, "utf-8")) as Funcionario;
    this.id = data.id;
    this.nome = data.nome;
    this.telefone = data.telefone;
    this.endereco = data.endereco;
    this.usuario = data.usuario;
    this.senha = data.senha;
    this.nivelPermissao = data.nivelPermissao;
  }
}