package com.example

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        StockXAppScreen()
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun StockXAppScreen() {
  var webView: WebView? by remember { mutableStateOf(null) }
  var canGoBack by remember { mutableStateOf(false) }

  BackHandler(enabled = canGoBack) {
    webView?.goBack()
  }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(androidx.compose.ui.graphics.Color(0xFF0B0F14))
      .statusBarsPadding()
      .testTag("stockx_main_screen")
  ) {
    AndroidView(
      modifier = Modifier
        .fillMaxSize()
        .testTag("stockx_webview"),
      factory = { context ->
        WebView(context).apply {
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
          )
          setBackgroundColor(Color.parseColor("#0B0F14"))

          settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
          }

          // In virtualized / cloud emulator containers without GPU rendernode devices,
          // ensure WebView does not crash or fail rendering.
          try {
            setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null)
          } catch (_: Exception) {
            setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null)
          }

          webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
              super.onPageFinished(view, url)
              canGoBack = view?.canGoBack() ?: false
            }
          }

          webChromeClient = WebChromeClient()

          loadUrl("file:///android_asset/stockx/index.html")
          webView = this
        }
      },
      update = { view ->
        webView = view
      }
    )
  }
}

