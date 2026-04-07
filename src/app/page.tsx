import BarraNavegacion from '@/components/Navbar'
import Inicio from '@/components/Hero'
import SobreMi from '@/components/About'
import SeccionTecnologias from '@/components/Stack'
import SeccionProyectos from '@/components/Projects'
import SeccionExperiencia from '@/components/Experience'
import Contacto from '@/components/Contact'
import PieDePagina from '@/components/Footer'

export default function Pagina() {
  return (
    <main className="bg-[#070b14] text-[#f1f5f9] min-h-screen overflow-x-hidden">
      <BarraNavegacion />
      <Inicio />
      <SobreMi />
      <SeccionTecnologias />
      <SeccionProyectos />
      <SeccionExperiencia />
      <Contacto />
      <PieDePagina />
    </main>
  )
}
