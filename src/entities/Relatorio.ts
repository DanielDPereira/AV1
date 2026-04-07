import { Aeronave } from "./Aeronave";
import * as fs from "fs";
import * as path from "path";

let conteudoRelatorio = "";
let nomeRelatorio = "relatorio.txt";

export class Relatorio {
  gerarRelatorio(aeronave: Aeronave): void {
    const cabecalho = `======================================\nRELATÓRIO DE ENTREGA - AERONAVE ${aeronave.codigo}\n======================================\n`;
    const dadosGerais = `MODELO: ${aeronave.modelo}\nTIPO: ${aeronave.tipo}\nCAPACIDADE: ${aeronave.capacidade}\nALCANCE: ${aeronave.alcance} km\n`;
    
    let pecasStr = "\n--- LISTA DE PEÇAS ---\n";
    aeronave.pecas.forEach(p => pecasStr += `* ${p.nome} (${p.fornecedor}) - ${p.tipo}\n`);

    let etapasStr = "\n--- HISTÓRICO DE PRODUÇÃO ---\n";
    aeronave.etapas.forEach(e => {
      etapasStr += `* ${e.nome} [${e.status}] (Prazo: ${e.prazo})\n`;
      e.funcionarios.forEach(f => etapasStr += `  - Resp: ${f.nome}\n`);
    });

    let testesStr = "\n--- AVALIAÇÕES DE QUALIDADE ---\n";
    aeronave.testes.forEach(t => testesStr += `* Teste ${t.tipo}: ${t.resultado}\n`);

    conteudoRelatorio = cabecalho + dadosGerais + pecasStr + etapasStr + testesStr;
    nomeRelatorio = `relatorio_${aeronave.codigo}.txt`;
    console.log(conteudoRelatorio);
  }

  salvarEmArquivo(): void {
    if (!conteudoRelatorio) {
      console.log("[ERRO] Nenhum relatório foi gerado para salvar.");
      return;
    }

    const dir = path.join(__dirname, "../../bd");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const caminho = path.join(dir, nomeRelatorio);
    fs.writeFileSync(caminho, conteudoRelatorio, "utf-8");
    console.log(`\n[OK] Relatório exportado para: ${caminho}`);
  }
}