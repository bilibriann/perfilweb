import BarraNavegacion from '@/components/Navbar'
import Inicio from '@/components/Hero'
import SobreMi from '@/components/About'
import SeccionTecnologias from '@/components/Stack'
import SeccionProyectos from '@/components/Projects'
import SeccionExperiencia from '@/components/Experience'
import Contacto from '@/components/Contact'
import PieDePagina from '@/components/Footer'
import DataWaveDivider from '@/components/DataWaveDivider'

// All sections use the theme surface variable so gradients shine through
const S = 'var(--theme-surface)'

export default function Pagina() {
  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ zIndex: 1 }}>
      <BarraNavegacion />
      <Inicio        bg={S} />
      <DataWaveDivider />
      <SobreMi       bg={S} />
      <DataWaveDivider />
      <SeccionTecnologias bg={S} />
      <DataWaveDivider />
      <SeccionProyectos   bg={S} />
      <DataWaveDivider />
      <SeccionExperiencia bg={S} />
      <DataWaveDivider />
      <Contacto      bg={S} />
      <PieDePagina   bg={S} />
    </main>
  )
}
