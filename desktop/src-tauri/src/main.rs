// Janela do Windows que abre o jogar.html (copiado para desktop/dist/index.html).
// Sem console preto atrás da janela na versão final.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    alquimia_de_bolso_lib::run();
}
