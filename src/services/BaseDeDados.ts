import * as fs from "fs";
import * as path from "path";

export class BaseDeDados {
  static salvarJSON(arquivo: string, dados: any) {
    const dir = path.join(__dirname, "../../bd");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, arquivo), JSON.stringify(dados, null, 2), "utf-8");
  }

  static lerJSON(arquivo: string): any[] {
    const caminho = path.join(__dirname, "../../bd", arquivo);
    if (!fs.existsSync(caminho)) return [];
    try {
      return JSON.parse(fs.readFileSync(caminho, "utf-8"));
    } catch {
      return [];
    }
  }
}