import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
      <ThemeProvider defaultTheme='dark'>
        <App />
      </ThemeProvider>
    </RecoilRoot>
)
