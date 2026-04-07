import { Funcionario } from "../entities/Funcionario";
import { BaseDeDados } from "./BaseDeDados";
import { NivelPermissao } from "../dominios/Enums";

export class EquipeRepo {
	private equipe: Funcionario[] = [];
	private readonly ARQUIVO = "equipe.json";
	private currentId = 1;

	constructor() {
		this.carregarDados();
		this.garantirAdmin();
	}

	private garantirAdmin() {
		if (this.equipe.length === 0) {
			this.adicionar(new Funcionario("", "Admin", "000", "Aerocode", "admin", "admin", NivelPermissao.ADMINISTRADOR));
		}
	}

	adicionar(func: Funcionario): boolean {
		if (this.equipe.find(f => f.usuario === func.usuario)) return false;
		func.id = String(this.currentId++);
		this.equipe.push(func);
		this.persistir();
		return true;
	}

	listar(): Funcionario[] { return this.equipe; }

	buscarPorId(id: string): Funcionario | undefined {
		return this.equipe.find(f => f.id === id);
	}

	fazerLogin(user: string, pass: string): Funcionario | undefined {
		return this.equipe.find(f => f.autenticar(user, pass));
	}

	private persistir() {
		BaseDeDados.salvarJSON(this.ARQUIVO, this.equipe);
	}

	private carregarDados() {
		const raw = BaseDeDados.lerJSON(this.ARQUIVO);
		this.equipe = raw.map(d => new Funcionario(String(d.id), d.nome, d.telefone, d.endereco, d.usuario, d.senha, d.nivelPermissao));
		if (this.equipe.length > 0) {
			const maioresIds = this.equipe
				.map(f => Number.parseInt(f.id, 10))
				.filter(n => !Number.isNaN(n));
			this.currentId = (maioresIds.length > 0 ? Math.max(...maioresIds) : 0) + 1;
		}
	}
}
