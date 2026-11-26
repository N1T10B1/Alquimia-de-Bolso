package __PACOTE__

// Copiado por cima do MainActivity.kt que o "tauri android init" gera (ver o job android em
// .github/workflows/exe-windows.yml). O padrão do Tauri desenha o jogo por baixo da barra de
// notificação e da barra de navegação; aqui o jogo fica entre as duas, com tarjas escuras
// (a cor do fundo da página do itch, #12131b) e ícones claros nas barras.

import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge(
      statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
      navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
    )
    super.onCreate(savedInstanceState)

    val tarja = Color.rgb(0x12, 0x13, 0x1b)
    window.decorView.setBackgroundColor(tarja)
    val conteudo = findViewById<View>(android.R.id.content)
    conteudo.setBackgroundColor(tarja)
    // Empurra a área do jogo para dentro das barras do sistema e do recorte da câmera.
    ViewCompat.setOnApplyWindowInsetsListener(conteudo) { v, insets ->
      val barras = insets.getInsets(
        WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
      )
      v.setPadding(barras.left, barras.top, barras.right, barras.bottom)
      WindowInsetsCompat.CONSUMED
    }
  }
}
