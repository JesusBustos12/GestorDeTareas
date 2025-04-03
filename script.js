/* 
  ==========================================================================
  GESTOR DE TAREAS - SCRIPT PRINCIPAL
  ==========================================================================
  Descripción: Maneja la lógica de la aplicación de gestión de tareas,
  incluyendo la navegación, formularios y manipulación de datos.
  ==========================================================================
*/

/* 
  ==========================================================================
  DECLARACIÓN DE CONSTANTES Y VARIABLES GLOBALES
  ==========================================================================
*/
// Elementos de navegación
const btnMisTareas = document.getElementById('btn-mis-tareas');
const btnNuevasTareas = document.getElementById('btn-nuevas-tareas');
const misTareasSection = document.getElementById('mis-tareas');
const nuevasTareasSection = document.getElementById('nuevas-tareas');

// Datos estáticos de la aplicación
const categorias = ["Deportes", "Estudios", "Deberes", "Pendientes"];
const etiquetas = ["Académico", "Laboral", "Del hogar", "Pasatiempos"];

// Elementos de formularios y listas
const formularioTarea = document.getElementById("formulario-tarea");
const listaTareas = document.getElementById("tareas");

// Almacenamiento de datos
let tareasCreadas = [];
let tareasCargadas = []; // Nuevo array para almacenar las tareas cargadas

/* 
  ==========================================================================
  FUNCIONES DE NAVEGACIÓN
  ==========================================================================
*/
function mostrarSeccion(idSeccion) {
    misTareasSection.style.display = 'none';
    nuevasTareasSection.style.display = 'none';

    const seccion = document.getElementById(idSeccion);
    if (seccion) {
        seccion.style.display = 'block';
    }
}

/* 
  ==========================================================================
  FUNCIONES DE MANIPULACIÓN DE SELECTORES
  ==========================================================================
*/
// Función para cargar opciones en un elemento select
function cargarOpciones(selectElement, opciones) {
    opciones.forEach(opcion => {
        const optionElement = document.createElement("option");
        optionElement.value = opcion.toLowerCase().replace(/\s+/g, "_");
        optionElement.textContent = opcion;
        selectElement.appendChild(optionElement);
    });
}

// Función para llenar los selects con datos del backend
function llenarSelectores(categorias, etiquetas) {
    const selects = {
        categoria: document.getElementById('categoria'),
        etiquetas: document.getElementById('etiquetas'),
        'editar-categoria': document.getElementById('editar-categoria'),
        'editar-etiquetas': document.getElementById('editar-etiquetas')
    };

    // Limpiar selects
    Object.values(selects).forEach(select => select.innerHTML = '');

    // Llenar categorías
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        selects.categoria.appendChild(option.cloneNode(true));
        selects['editar-categoria'].appendChild(option.cloneNode(true));
    });

    // Llenar etiquetas
    etiquetas.forEach(etiq => {
        const option = document.createElement('option');
        option.value = etiq.id;
        option.textContent = etiq.nombre;
        selects.etiquetas.appendChild(option.cloneNode(true));
        selects['editar-etiquetas'].appendChild(option.cloneNode(true));
    });
}

/* 
  ==========================================================================
  FUNCIONES DE GESTIÓN DE TAREAS
  ==========================================================================
*/
// Función para mostrar las tareas en la sección "Mis Tareas"
function mostrarTareas() {
    // Limpiar la lista de tareas
    listaTareas.innerHTML = "";

    // Mostrar todas las tareas creadas
    tareasCreadas.forEach((tarea, index) => {
        const li = document.createElement("li");

        // Crear el contenedor de iconos
        const iconosDiv = document.createElement("div");
        iconosDiv.className = "iconos-tarea";

       // Crear icono de editar
        const iconoEditar = document.createElement("img");
        iconoEditar.src = "Iconos/editar.png";
        iconoEditar.alt = "Editar";
        iconoEditar.onclick = () => editarTarea(index);

        // Crear icono de eliminar
        const iconoEliminar = document.createElement("img");
        iconoEliminar.src = "Iconos/eliminar.png";
        iconoEliminar.alt = "Eliminar";
        iconoEliminar.onclick = () => eliminarTarea(index);

        // Agregar iconos al contenedor
        iconosDiv.appendChild(iconoEditar);
        iconosDiv.appendChild(iconoEliminar);

        // Contenido de la tarea
        li.innerHTML = `
            <h3>${tarea.nombre}</h3>
            <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
            <p><strong>Categoría:</strong> ${tarea.categoria}</p>
            <p><strong>Etiquetas:</strong> ${tarea.etiquetas}</p>
            <p><strong>Fecha Límite:</strong> ${tarea.fechaLimite || "No especificada"}</p>
            <p><strong>Estado:</strong> ${tarea.estado}</p>
        `;

        // Agregar el contenedor de iconos
        li.appendChild(iconosDiv);
        listaTareas.appendChild(li);
    });
}

// Función para eliminar una tarea
function eliminarTarea(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        tareasCreadas.splice(index, 1);
        mostrarTareas();
    }
}

// Función para editar una tarea
function editarTarea(index) {
    const tarea = tareasCreadas[index];
    const modal = document.getElementById('modal-editar-tarea');

    // Obtener los selectores
    const selectCategoria = document.getElementById('editar-categoria');
    const selectEtiquetas = document.getElementById('editar-etiquetas');

    // Limpiar los selectores
    selectCategoria.innerHTML = '';
    selectEtiquetas.innerHTML = '';

    // Cargar las opciones
    cargarOpciones(selectCategoria, categorias);
    cargarOpciones(selectEtiquetas, etiquetas);

    // Llenar el formulario con los datos de la tarea
    document.getElementById('editar-nombre').value = tarea.nombre;
    document.getElementById('editar-descripcion').value = tarea.descripcion;
    document.getElementById('editar-categoria').value = tarea.categoria;
    document.getElementById('editar-etiquetas').value = tarea.etiquetas;
    document.getElementById('editar-fecha-limite').value = tarea.fechaLimite;

    // Mostrar el modal
    modal.style.display = 'block';

    // Manejar el envío del formulario de edición
    const formularioEditar = document.getElementById('formulario-editar-tarea');
    formularioEditar.onsubmit = (e) => {
        e.preventDefault();

        // Actualizar la tarea con los nuevos valores
        tareasCreadas[index] = {
            nombre: document.getElementById('editar-nombre').value,
            descripcion: document.getElementById('editar-descripcion').value,
            categoria: document.getElementById('editar-categoria').value,
            etiquetas: document.getElementById('editar-etiquetas').value,
            fechaLimite: document.getElementById('editar-fecha-limite').value,
            estado: tarea.estado
        };

        // Cerrar el modal y actualizar la lista
        modal.style.display = 'none';
        mostrarTareas();
    };

    // Cerrar el modal al hacer clic en la X
    document.querySelector('.cerrar-modal').onclick = () => {
        modal.style.display = 'none';
    };
}

// Event Listener para el formulario de nueva tarea
formularioTarea.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const categoria = document.getElementById("categoria").value;
    const etiquetas = document.getElementById("etiquetas").value;
    const fechaLimite = document.getElementById("fecha-limite").value;

    // Validar que los campos requeridos no estén vacíos
    if (!nombre || !categoria || !etiquetas) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Crear un objeto con los datos de la nueva tarea
    const nuevaTarea = {
        nombre,
        descripcion,
        categoria,
        etiquetas,
        fechaLimite,
        estado: "Pendiente",
    };

    // Agregar la tarea al array de tareas creadas
    tareasCreadas.push(nuevaTarea);

    // Mostrar mensaje de confirmación
    alert("La tarea fue creada.");

    // Limpiar los campos del formulario
    formularioTarea.reset();

    // Mostrar la sección de Mis Tareas y actualizar la lista
    mostrarSeccion('mis-tareas');
    mostrarTareas();
});

// Event Listeners de navegación
btnMisTareas.addEventListener('click', function () {
    mostrarSeccion('mis-tareas');
    mostrarTareas();
});

btnNuevasTareas.addEventListener('click', function () {
    mostrarSeccion('nuevas-tareas');
});

/* 
  ==========================================================================
  FUNCIONES DE COMUNICACIÓN CON EL BACKEND
  ==========================================================================
*/
// Obtener categorías y etiquetas desde el backend
async function obtenerOpcionesSelectores() {
    try {
        // Usar datos estáticos en lugar de llamadas al backend
        const categorias = [
            { id: 1, nombre: "Deportes" },
            { id: 2, nombre: "Estudios" },
            { id: 3, nombre: "Deberes" },
            { id: 4, nombre: "Pendientes" }
        ];
        
        const etiquetas = [
            { id: 1, nombre: "Académico" },
            { id: 2, nombre: "Laboral" },
            { id: 3, nombre: "Del hogar" },
            { id: 4, nombre: "Pasatiempos" }
        ];

        llenarSelectores(categorias, etiquetas);
    } catch (error) {
        console.error('Error obteniendo datos:', error);
    }
}

/* 
  ==========================================================================
  INICIALIZACIÓN DE LA APLICACIÓN
  ==========================================================================
*/
// Ejecutar al cargar la página 
document.addEventListener('DOMContentLoaded', () => {
    // Limpiar los selectores antes de cargar las opciones
    const selectCategoria = document.getElementById("categoria");
    const selectEtiquetas = document.getElementById("etiquetas");

    // Limpiar los selectores
    selectCategoria.innerHTML = '';
    selectEtiquetas.innerHTML = '';

    // Cargar las opciones iniciales
    cargarOpciones(selectCategoria, categorias);
    cargarOpciones(selectEtiquetas, etiquetas);
});
