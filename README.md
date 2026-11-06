# Portafolio — Oscar David Gómez

Sitio de una página para el ingeniero mecánico Oscar David Gómez, elaborado a partir de la información de su hoja de vida y de la referencia visual `referencia.webp`.

## Cómo verlo

Abre `index.html` directamente en el navegador o levanta un servidor local:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Estructura

```
index.html                  Página principal
css/styles.css              Sistema visual, animaciones y diseño adaptable
js/main.js                  Navegación, desplazamiento suave, contadores y animaciones de aparición
assets/oscar-gomez.webp     Retrato del portafolio
assets/shape-gear.svg       Forma 3D: engranaje
assets/shape-sphere.svg     Forma 3D: esfera
assets/shape-ring.svg       Forma 3D: anillo
assets/shape-cube.svg       Forma 3D: cubo
favicon.svg                 Icono del sitio
referencia.webp             Referencia visual
```

La hoja de vida no se incluye en el repositorio por privacidad. Se solicita desde el sitio y se comparte después de autorizar la petición.

## Decisiones de diseño

- **Paleta:** azul de confianza (`#2563EB` / `#1D4ED8`) con degradado de azul profundo a blanco a lo largo de la página, paneles azul noche y acento azul claro (`#4D8DFF`).
- **Tipografía:** Plus Jakarta Sans en pesos 400–800; titulares compactos y números grandes con `tabular-nums`.
- **Disposición:** paneles flotantes tipo aplicación SaaS, tarjetas internas, gráfico de trayectoria en SVG y formas 3D decorativas en cada sección.
- **Dinamismo:** desplazamiento suave en menús y llamadas a la acción, aparición gradual al desplazarse, efecto de luz al pasar el cursor sobre las tarjetas, inclinación 3D del panel principal, dibujo animado del gráfico, contadores y medidor circular animados.
- **Móvil:** una columna, métricas en 2 columnas, botones de ancho completo y navegación inferior fija estilo aplicación.
- **Accesibilidad:** estructura semántica, foco visible, textos alternativos, `aria-current` en la navegación y soporte completo para `prefers-reduced-motion`.
- **Privacidad:** el sitio no publica el teléfono, la dirección exacta ni los datos de las referencias. La hoja de vida se solicita mediante un formulario y se comparte con autorización.
- **Contenido:** la experiencia, las habilidades y las certificaciones provienen del CV. Se añadió la formación **Técnico en Análisis de Datos con Inteligencia Artificial del SENA**.
- **Hoja de vida:** se rediseñó y se corrigieron la ortografía, la semántica y la redacción. El archivo se mantiene privado y no se descarga públicamente.

Las tipografías se cargan desde Google Fonts. Sin conexión se usan las fuentes del sistema.
