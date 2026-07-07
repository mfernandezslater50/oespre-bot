# Base de Conocimiento — OESPRE 2.0

Esta es la documentación del sistema OESPRE 2.0 que el asistente usa para responder preguntas de los usuarios.

## Qué es OESPRE 2.0

OESPRE 2.0 es un sistema profesional de presupuestación de obras de construcción, diseñado para empresas constructoras, oficinas técnicas y profesionales. Funciona de manera local en el equipo del usuario (aplicación de escritorio Windows), sin depender de internet para operar.

## Estructura jerárquica de la información

- **Proyecto**: la obra o encargo. Contiene datos del cliente, ubicación y superficie.
- **Presupuesto**: pertenece a un proyecto. Un proyecto puede tener varios presupuestos.
- **Revisión**: versión del presupuesto (R1, R2, R3...). Permite mantener historial.
- **Capítulo**: agrupación mayor de partidas (ej: Obra Gruesa, Terminaciones).
- **Subcapítulo**: subdivisión opcional dentro de un capítulo.
- **Partida**: ítem presupuestario con cantidad, unidad y precio unitario.
- **APU**: Análisis de Precios Unitarios. Desglose de recursos que componen el precio de una partida.
- **Recurso**: material, mano de obra, maquinaria o subcontrato individual.

## Instalación

Ejecutar el instalador `OESPRE 2.0_x64-setup.exe` y seguir el asistente. No requiere reiniciar el equipo. Los datos del usuario se almacenan en `AppData\Roaming\com.oespre.desktop` y se preservan entre actualizaciones.

Para actualizar: ejecutar el nuevo instalador y seleccionar **"Add/Reinstall components"**. Los presupuestos, recursos y licencias existentes NO se pierden. Antes de actualizar, cerrar OESPRE completamente y verificar en el Administrador de Tareas que no quede ningún proceso "node.exe" u "OESPRE" en ejecución.

## Licenciamiento

Cada licencia está vinculada al equipo mediante el ID de máquina (Machine ID).

Para obtener una licencia:
1. Al abrir OESPRE sin licencia, el sistema muestra el ID de máquina.
2. Copiar ese ID y enviarlo a soporte@oespre.cl.
3. Se recibe un archivo `license.oespre` junto con usuario, contraseña y un PIN de recuperación.
4. En la pantalla de inicio, hacer clic en "Importar license.oespre" y seleccionar el archivo.
5. Ingresar usuario y contraseña, hacer clic en "Iniciar sesión".

Recuperar contraseña olvidada: en la pantalla de login, hacer clic en "¿Olvidaste tu contraseña?". Ingresar usuario, el PIN de recuperación de 4 dígitos, y la nueva contraseña. Sin el PIN correcto no se puede cambiar la contraseña. El PIN se entrega junto con la licencia y debe guardarse en un lugar seguro.

## Panel Principal (Dashboard)

Pantalla de inicio tras autenticarse. Muestra indicadores: cantidad de proyectos, presupuestos, m² totales, valor UF del día, tipo de cambio USD y EUR (actualizados automáticamente). Lista los proyectos recientes ordenados por última modificación.

La barra lateral izquierda da acceso a: Inicio, Proyectos, Recursos, Presupuestos Externos, Libro Cero, Flujos de Caja y Configuración. Puede colapsarse para ganar espacio.

## Gestión de Proyectos

Crear un proyecto: clic en "+ Nuevo Proyecto". Completar nombre, descripción, ubicación, cliente, mandante, superficie (m²), tipo y categoría.

Acciones: Abrir (entra al detalle), Editar (modifica datos), Eliminar, Abrir .oespre (importa un proyecto desde archivo externo).

En el detalle del proyecto se ven sus datos, el Agente de Recursos y la lista de presupuestos con sus revisiones. Para crear un presupuesto: escribir nombre y clic en "+ Nuevo Presupuesto". Cada presupuesto comienza con la Revisión 1. Para nueva versión: "+ Nueva Revisión" (hereda la estructura). Clic en "Abrir Presupuesto" para editar una revisión.

Usar revisiones para mantener historial de cambios: R1 propuesta inicial, R2 ajustada tras observaciones, R3 versión final.

## Editor de Presupuesto

La barra superior muestra los totales en tiempo real:
- **Costo Directo**: suma de todas las partidas (cantidad × precio unitario).
- **GG**: Gastos Generales totales.
- **GI**: Gastos Indirectos totales.
- **Utilidad**: calculada como porcentaje del Costo Directo.
- **Neto**: Costo Directo + GG + GI + Utilidad.
- **IVA**: impuesto sobre el Neto (configurable, por defecto 19%).
- **Total Bruto**: Neto + IVA.

Los campos de IVA y Utilidad en la barra superior son editables. La Utilidad se calcula sobre el Costo Directo solamente.

Construir la estructura: clic en "+ Capítulo" para crear un capítulo. Sobre un capítulo, usar el botón SC para subcapítulo o P para partida directa. Editar nombre, unidad y cantidad directamente en la tabla. Arrastrar partidas con el icono de puntos para reordenarlas.

**Cantidades con fórmulas**: el campo de cantidad acepta fórmulas matemáticas como en Excel. Por ejemplo, escribir `=2*3.5+1.2` o `=12*0.3*2.5` y el sistema calcula el resultado. Cuando una celda contiene una fórmula, su valor se muestra en azul. Al hacer doble clic vuelve a mostrar la fórmula para editarla.

Pestañas del presupuesto: Estructura, Gastos Generales, Gastos Indirectos, Incidencia.

## Editor de APU (Análisis de Precios Unitarios)

Define cómo se compone el precio unitario de una partida a partir de sus recursos.

Abrir el APU: clic en el botón verde "P" a la izquierda de cada partida. Se abre el panel del APU en el costado derecho.

Tarjetas de resumen: subtotal por tipo de recurso (Materiales, Mano de Obra, Equipos, Subcontratos, Varios) y el Total CD (costo directo unitario de la partida).

Agregar recursos: clic en "Buscar recurso de la base maestra", escribir el nombre (ej: cemento, fierro, grúa), seleccionar de la lista. Se agrega con cantidad inicial 1. Ajustar cantidad, merma (%) y recargo (%).

Desde el APU solo se pueden agregar recursos que ya existan en la base maestra. Para crear un recurso nuevo, ir al módulo Recursos.

Herramientas inteligentes:
- **APU histórico**: busca APUs similares en otros presupuestos y biblioteca para reutilizar su composición (agregar o reemplazar).
- **IA Recomendar APU**: sugiere recursos basándose en el histórico.
- **Abrir en ventana**: abre el APU en una ventana independiente y ampliada.

Columnas editables de cada recurso: Cantidad (acepta fórmulas), P.Unit. (heredado de la base maestra), Merma % (desperdicio que incrementa la cantidad), Rec. % (recargo que incrementa el precio).

Botones de deshacer y rehacer para corregir errores.

## Gastos Generales (GG)

Costos de administración y operación de la obra que no se asignan a una partida específica: personal profesional, oficina, seguridad, vehículos.

Se organizan por categorías: Profesionales, Jefes de Obra, Personal Administrativo, Personal de Apoyo, Ensayos, Seguridad Industrial, Equipos y Vehículos, Combustibles, Gastos de Oficina.

Agregar: clic en "+ Agregar Capítulo GG" para crear una categoría. Dentro del grupo, usar "Buscar" para agregar recursos desde la base maestra de GG. Definir cantidad (ej: meses) y precio unitario.

Recursos porcentuales: algunos GG pueden definirse como porcentaje sobre el Costo Directo. Activar la casilla "%?" en la fila del recurso y especificar el porcentaje.

Los cambios se guardan automáticamente al salir del campo.

## Gastos Indirectos (GI)

Se expresan como porcentaje del Costo Directo total. Incluyen gastos financieros, boletas de garantía, seguros y similares.

Agregar: clic en "+ Gasto Indirecto". Ingresar código, descripción y porcentaje. La columna Base muestra el Costo Directo sobre el que se calcula. La columna Total muestra el monto resultante. Los GI se recalculan automáticamente cuando cambia el Costo Directo.

## Recursos Maestros

Catálogo central de la empresa con todos los materiales, mano de obra, maquinarias, subcontratos y varios usados en los APU y GG.

Tipos: Materiales, Mano de Obra, Maquinarias, Subcontratos, Varios, Gastos Generales.

Crear un recurso: clic en "Nuevo Recurso". Ingresar descripción, tipo. Opcionalmente asociar una Partida del Libro Cero (recomendado para control contable). Definir unidad, precio base y moneda. El código se sugiere automáticamente. Clic en "Crear recurso". La cuenta contable es opcional.

Al asociar un recurso a una Partida del Libro Cero, ese vínculo se copia automáticamente a los APU donde se use, permitiendo generar reportes de control por cuenta contable.

Carga masiva: "Descargar Plantilla" (Excel modelo), "Subir Excel Actualizado" (actualiza precios y agrega recursos, muestra preview antes de aplicar), "Historial de Actualizaciones".

Buscar por código, descripción o cuenta. Filtrar por tipo. "Escanear recursos mal clasificados" detecta recursos cuyo tipo no coincide con su cuenta contable.

## Libro Cero

Estructura de control que vincula los recursos del presupuesto con divisiones de costo y cuentas contables. Se define una sola vez para la empresa y permite generar reportes de control financiero.

Divisiones de costo (agrupadores financieros mayores, personalizables): CD (Costos Directos), DA (Costos Adicionales), GG (Gastos Generales), GI (Gastos Indirectos).

Partidas del Libro Cero: dentro de cada división, con código (ej: CD010), glosa (descripción) y código contable (seleccionable desde el Plan de Cuentas).

Crear: en el panel izquierdo "+ Agregar" para una división. Seleccionar la división para ver sus partidas. "+ Agregar partida" e ingresar código, glosa y seleccionar el código contable del desplegable.

Cada recurso del maestro puede asociarse a una partida del Libro Cero (opcional). Cuando ese recurso se agrega a un APU, el vínculo se transfiere automáticamente, permitiendo que cada presupuesto genere su propio Libro Cero.

## Presupuestos Externos

Importar presupuestos elaborados fuera de OESPRE en formatos estándar.

Formatos soportados: Excel (.xlsx) y BC3 (.bc3, formato FIEBDC-3).

Importar: clic en "Importar Presupuesto", seleccionar el archivo, asignar nombre, confirmar. Usar "Descargar Plantilla" para obtener un Excel modelo con el formato correcto.

## Exportación

Abrir el diálogo con el botón "Exportar" en la barra superior del presupuesto.

Formatos disponibles:
- **Excel (.xlsx)**: para entrega al cliente. Opción de incluir detalle de APU.
- **PDF (.pdf)**: documento de presentación con logo de la empresa, listo para imprimir.
- **BC3 (.bc3)**: intercambio con otros software (FIEBDC-3).
- **OESPRE (.oespre)**: respaldo completo del proyecto o transferencia a otro equipo.

Monedas de exportación: CLP, USD, UF, EUR. El sistema convierte usando los tipos de cambio vigentes.

El logo de la empresa configurado en Configuración aparece automáticamente en la esquina superior derecha de las exportaciones PDF y Excel.

## Configuración

Parámetros globales de la empresa:
- **Plan de cuentas**: catálogo de cuentas contables. Usado al crear recursos, en el Libro Cero y por el agente de importación. Clic en "Gestionar".
- **Empresa**: nombre, RUT y logo (aparece en exportaciones). Formatos PNG, JPG o SVG, tamaño recomendado 300×100 px. Usar "Cambiar logo".
- **Indicadores económicos**: valor UF manual (usado en KPIs como "Costo Neto UF/m²") y tasa IVA por defecto (19% en Chile).

## Multi-ventana

Se pueden abrir presupuestos en ventanas independientes y copiar capítulos, subcapítulos y APUs entre ellas. En el APU, "Abrir en ventana" abre una vista ampliada e independiente. No es necesario volver a iniciar sesión en cada ventana.

## Preguntas frecuentes

**¿Cómo actualizar sin perder datos?** Ejecutar el nuevo instalador y seleccionar "Add/Reinstall components". Los datos están en AppData, separados del programa. Cerrar OESPRE completamente antes.

**¿Olvidé mi contraseña?** En el login, "¿Olvidaste tu contraseña?". Ingresar usuario, PIN de recuperación de 4 dígitos y nueva contraseña.

**¿Cómo transferir un presupuesto a otro computador?** Exportar el proyecto como archivo .oespre desde el botón Exportar. En el otro equipo, usar "Abrir .oespre" en Proyectos.

**¿El programa se queda en "Verificando licencia"?** Esperar hasta 30 segundos (al iniciar recalcula los presupuestos). Si persiste, verificar que ningún antivirus bloquee el proceso y hacer clic en "Reintentar".

**¿Cómo cambiar el logo?** Configuración > Logo de empresa > Cambiar logo.

**¿Las cantidades aceptan fórmulas?** Sí. Escribir una expresión como `=2*3.5+1.2` en el campo de cantidad. El valor se muestra en azul y la fórmula se conserva.

**¿Cómo vincular recursos con cuentas contables?** Al crear o editar un recurso, seleccionar una Partida del Libro Cero. El vínculo se transfiere a los APU donde se use.
