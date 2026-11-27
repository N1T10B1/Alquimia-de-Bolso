// Ponto de entrada comum ao Windows (main.rs chama run) e ao Android (mobile_entry_point).
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("não foi possível abrir a Alquimia de Bolso");
}
