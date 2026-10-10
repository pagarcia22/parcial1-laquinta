# Distribuidora La Quinta S.A.S. — Control de despachos

## Descripción

Aplicación web académica para apoyar el registro y seguimiento de despachos de productos de la Distribuidora La Quinta S.A.S. La interfaz permite diligenciar solicitudes y consultar el historial de movimientos, según las integraciones configuradas en el proyecto.

## Funcionalidades

- **Registro de despachos:** captura los datos del solicitante y de la solicitud.
- **Validación de solicitudes:** envía los datos al servicio externo configurado para procesar el despacho.
- **Visualización del resultado:** presenta la respuesta recibida del proceso de validación.
- **Historial de movimientos:** permite consultar los registros disponibles.
- **Actualización de información:** permite volver a cargar los datos del historial.

> Las funciones que dependen de servicios externos requieren que las integraciones estén disponibles y configuradas correctamente.

## Tecnologías utilizadas

- **HTML5:** estructura de la página.
- **CSS3:** estilos y presentación visual.
- **JavaScript:** validaciones y lógica de la interfaz.
- **Make (webhook):** procesamiento externo de las solicitudes, si está configurado.
- **Google Sheets:** fuente del historial, si está configurada.

## Estructura del proyecto

```text
parcial1-laquinta/
├── index.html
├── style.css
├── app.js
└── README.md
```

- `index.html`: estructura de la aplicación.
- `style.css`: estilos de la interfaz.
- `app.js`: lógica e integración con los servicios externos.
- `README.md`: documentación del proyecto.

## Instalación y ejecución

1. Clona el repositorio:

   ```bash
   git clone https://github.com/pagarcia22/parcial1-laquinta.git
   ```

2. Entra a la carpeta:

   ```bash
   cd parcial1-laquinta
   ```

3. Abre `index.html` en tu navegador. También puedes usar la extensión **Live Server** de Visual Studio Code para ejecutarlo localmente.

No se requiere instalar dependencias con npm para abrir la interfaz estática. Las funciones conectadas a servicios externos dependerán de sus respectivas configuraciones.

## Uso general

1. Abre la aplicación en el navegador.
2. Completa el formulario de registro del despacho.
3. Revisa los datos antes de enviar la solicitud.
4. Consulta el resultado que devuelve el proceso de validación.
5. Abre el historial para revisar los movimientos disponibles.

## Consideraciones

- La disponibilidad de la validación depende del webhook y del escenario configurado en Make.
- La consulta del historial depende de la fuente de datos configurada.
- No publiques credenciales, tokens ni enlaces privados de servicios externos en el repositorio.
- Este proyecto se presenta con fines académicos.

## Autoría

Proyecto académico — Parcial 1.

