import BarraNavegacion from '@/components/Navbar'
import Inicio from '@/components/Hero'
import SobreMi from '@/components/About'
import SeccionTecnologias from '@/components/Stack'
import SeccionProyectos from '@/components/Projects'
import SeccionExperiencia from '@/components/Experience'
import Contacto from '@/components/Contact'
import PieDePagina from '@/components/Footer'
import DataWaveDivider from '@/components/DataWaveDivider'
import { SECTION_COLORS } from '@/lib/colors'

export default function Pagina() {
  const C = SECTION_COLORS
  return (
    <main className="text-[#f0f4f8] min-h-screen overflow-x-hidden"
          style={{ background: C.hero }}>
      <BarraNavegacion />
      <Inicio        bg={C.hero} />
      <DataWaveDivider colorAbove={C.hero}       colorBelow={C.about} />
      <SobreMi       bg={C.about} />
      <DataWaveDivider colorAbove={C.about}      colorBelow={C.stack} />
      <SeccionTecnologias bg={C.stack} />
      <DataWaveDivider colorAbove={C.stack}      colorBelow={C.projects} />
      <SeccionProyectos   bg={C.projects} />
      <DataWaveDivider colorAbove={C.projects}   colorBelow={C.experience} />
      <SeccionExperiencia bg={C.experience} />
      <DataWaveDivider colorAbove={C.experience} colorBelow={C.contact} />
      <Contacto      bg={C.contact} />
      <PieDePagina   bg={C.contact} />
    </main>
  )
}
