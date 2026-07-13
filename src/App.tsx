import { useTheme } from './lib/theme'
import Header from './components/Header'
import Hero from './components/Hero'
import ToolSection from './components/ToolSection'
import Footer from './components/Footer'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-bg text-fg transition-colors duration-200" data-theme={theme}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="pt-20 md:pt-16">
        <Hero />
        <ToolSection />
      </main>

      {/* Placeholder para conteúdo futuro */}
      <div id="conteudo" />
      <div>
        
      </div>
      <Footer />
    </div>
  )
}
