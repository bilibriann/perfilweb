import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Coreografía de entrada única de la página.
 *
 * Es la que estrenó el panel de contacto al abrirse con el burger; ahora la
 * comparten todos los bloques que aparecen al cargar, para que el hero y el
 * panel entren con el mismo ritmo en vez de cada uno por su cuenta.
 */
export const ENTRADA = {
  desde: { opacity: 0, y: 22 },
  duracion: 0.45,
  escalonado: 0.07,
  ease: 'power3.out',
} as const;

/** Deslizamiento lateral del panel (el mismo que usa el burger). */
export const DESLIZAMIENTO = {
  duracion: 0.5,
  ease: 'power3.out',
} as const;

/**
 * Momento en que empieza la cascada al cargar la página: cuando al panel de
 * contacto le queda poco de deslizamiento. El hero usa este retraso para entrar
 * a la vez que el panel y no medio segundo antes.
 */
export const RETRASO_ENTRADA = DESLIZAMIENTO.duracion - 0.15;

/** Estado inicial: oculto y desplazado. Aplicar antes del primer pintado. */
export function prepararEntrada(items: gsap.TweenTarget): void {
  gsap.set(items, ENTRADA.desde);
}

/** Vars del revelado en cascada, para insertarlo dentro de una timeline. */
export function varsEntrada(extra: gsap.TweenVars = {}): gsap.TweenVars {
  return {
    opacity: 1,
    y: 0,
    duration: ENTRADA.duracion,
    stagger: ENTRADA.escalonado,
    ease: ENTRADA.ease,
    ...extra,
  };
}

/** Revela los elementos en cascada, por sí solo. */
export function animarEntrada(
  items: gsap.TweenTarget,
  extra: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.to(items, varsEntrada(extra));
}

/** El visitante pidió menos animación: se revela todo de una y sin moverse. */
export function movimientoReducido(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Aparición del bloque completo al llegar a él scrolleando: el componente entero
 * pasa de invisible a visible como una sola pieza, no por partes. Se revela una
 * vez y se queda.
 *
 * Devuelve la función de limpieza que hay que llamar al desmontar.
 */
export function revelarBloqueAlEntrar(bloque: HTMLElement): () => void {
  // Sin animación el bloque debe quedar visible, nunca en opacidad 0.
  if (movimientoReducido()) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(bloque, { opacity: 0 });

  const st = ScrollTrigger.create({
    trigger: bloque,
    start: 'top 85%',
    once: true,
    onEnter: () =>
      gsap.to(bloque, {
        opacity: 1,
        duration: ENTRADA.duracion,
        ease: ENTRADA.ease,
      }),
  });

  return () => st.kill();
}

/**
 * `useLayoutEffect` en cliente, `useEffect` en el render del servidor: evita el
 * parpadeo de un frame con el contenido ya visible y, a la vez, el aviso de
 * React por usar layout effects durante el prerender.
 */
export const useEntradaLayout =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
