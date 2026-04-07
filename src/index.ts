import { SistemaCLI } from "./ui/SistemaCLI";

const app = new SistemaCLI();

app.iniciar().catch(err => {
  console.error("Erro fatal no sistema:", err);
  process.exit(1);
});