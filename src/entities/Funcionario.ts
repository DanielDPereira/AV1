import { NivelPermissao } from "../dominios/Enums";
import * as fs from "fs";
import * as path from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export class Funcionario {
  private static readonly HASH_PREFIX = "scrypt";
  private static readonly KEY_LENGTH = 64;

  constructor(
    public id: string,
    public nome: string,
    public telefone: string,
    public endereco: string,
    public usuario: string,
    public senha: string,
    public nivelPermissao: NivelPermissao
  ) {}

  static senhaEstaCriptografada(senhaArmazenada: string): boolean {
    return senhaArmazenada.startsWith(`${Funcionario.HASH_PREFIX}$`);
  }

  static criptografarSenha(senha: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(senha, salt, Funcionario.KEY_LENGTH).toString("hex");
    return `${Funcionario.HASH_PREFIX}$${salt}$${hash}`;
  }

  static validarSenha(senhaInformada: string, senhaArmazenada: string): boolean {
    if (!Funcionario.senhaEstaCriptografada(senhaArmazenada)) {
      return senhaInformada === senhaArmazenada;
    }

    const partes = senhaArmazenada.split("$");
    if (partes.length !== 3) return false;

    const salt = partes[1];
    const hashHex = partes[2];
    if (!salt || !hashHex) return false;

    const hashInformado = scryptSync(senhaInformada, salt, Funcionario.KEY_LENGTH);
    const hashArmazenado = Buffer.from(hashHex, "hex");

    if (hashInformado.length !== hashArmazenado.length) return false;
    return timingSafeEqual(hashInformado, hashArmazenado);
  }

  definirSenha(senha: string): void {
    this.senha = Funcionario.criptografarSenha(senha);
  }

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && Funcionario.validarSenha(senha, this.senha);
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