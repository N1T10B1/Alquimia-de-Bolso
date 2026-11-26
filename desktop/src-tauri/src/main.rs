// Janela do Windows que abre o jogar.html (copiado para desktop/dist/index.html).
// Sem console preto atrás da janela na versão final.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("não foi possível abrir a Alquimia de Bolso");
}
