// script.js corregido para películas

const peliculasPorPagina = 24;
let paginaActual = 1;
let slideIndex = 0;

function filtrarPorLetra(letra) {
  const peliculas = document.querySelectorAll(".pelicula");
  peliculas.forEach(peli => {
    const titulo = peli.querySelector("h3").textContent.toUpperCase();
    peli.style.display = titulo.startsWith(letra) ? "inline-block" : "none";
  });
}

function mostrarTodas() {
  document.querySelectorAll(".pelicula").forEach(peli => {
    peli.style.display = "inline-block";
  });
}

function buscarPeliculas() {
  const texto = document.getElementById("buscarInput").value.toLowerCase();
  const peliculas = document.querySelectorAll(".pelicula");

  peliculas.forEach(peli => {
    const titulo = peli.querySelector("h3").textContent.toLowerCase();
    const año = peli.querySelector(".año")?.textContent.toLowerCase();

    peli.style.display = (titulo.includes(texto) || año.includes(texto)) ? "inline-block" : "none";
  });
}

function abrirModal(titulo, servidores) {
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modal").style.display = "block";

  const peli = Array.from(document.querySelectorAll(".pelicula"))
    .find(p => p.querySelector("h3").textContent === titulo);
  const sinopsis = peli?.getAttribute("data-sinopsis") || "Sinopsis no disponible.";
  document.getElementById("modalSinopsis").textContent = sinopsis;

  const fondo = peli?.getAttribute("data-fondo") || "";
  document.querySelector(".modal-contenido").style.backgroundImage = `url('${fondo}')`;

  const contenedor = document.getElementById("servidores");
  contenedor.innerHTML = "";

  servidores.forEach((srv, index) => {
    const boton = document.createElement("button");
    boton.textContent = srv.nombre;
    boton.onclick = () => {
      document.getElementById("modalVideo").src = srv.url;
    };
    contenedor.appendChild(boton);

    if (index === 0) {
      document.getElementById("modalVideo").src = srv.url;
    }
  });
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modalVideo").src = "";
}

function paginarPeliculas() {
  const todasLasPeliculas = document.querySelectorAll(".pelicula");
  const totalPaginas = Math.ceil(todasLasPeliculas.length / peliculasPorPagina);

  todasLasPeliculas.forEach(p => p.style.display = "none");

  const inicio = (paginaActual - 1) * peliculasPorPagina;
  const fin = inicio + peliculasPorPagina;

  for (let i = inicio; i < fin && i < todasLasPeliculas.length; i++) {
    todasLasPeliculas[i].style.display = "inline-block";
  }

  const contenedor = document.getElementById("paginacion");
  contenedor.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    if (i === paginaActual) boton.classList.add("active");

    boton.onclick = () => {
      paginaActual = i;
      paginarPeliculas();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    contenedor.appendChild(boton);
  }
}

function cargarCarrusel() {
  const peliculas = Array.from(document.querySelectorAll('.pelicula'));
  const ultimas = peliculas.slice(0, 5);

  const slider = document.getElementById('slider-contenido');
  const indicadores = document.getElementById('indicadores');
  if (!slider || !indicadores) return;

  slider.innerHTML = '';
  indicadores.innerHTML = '';

  ultimas.forEach((peli, index) => {
    const fondo = peli.dataset.fondo || peli.querySelector("img")?.src;
    const titulo = peli.querySelector('h3')?.innerText || '';
    const año = peli.querySelector('.año')?.innerText || '';
    const calidad = peli.querySelector('.calidad')?.innerText || '';
    const idioma = peli.querySelector('.idioma')?.innerText || '';
    const onclick = peli.getAttribute("onclick");

    const slide = document.createElement('div');
    slide.className = 'slide';
    if (index === 0) slide.classList.add('active');

    slide.style.backgroundImage = `url('${fondo}')`;
    slide.style.backgroundSize = "cover";
    slide.style.backgroundPosition = "center";

    slide.innerHTML = `
      <div class="content">
        <h2>${titulo}</h2>
        <p class="info">📅 ${año} | 🎞️ ${calidad} | 
          <img src="https://flagcdn.com/w40/mx.png" alt="México" style="width: 20px; vertical-align: middle;"> ${idioma}
        </p>
        <button class="watch" onclick="${onclick}">▶ VER AHORA</button>
      </div>
    `;

    slider.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active-dot');
    dot.onclick = () => mostrarSlide(index);
    indicadores.appendChild(dot);
  });
}

function mostrarSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  slideIndex = (n + slides.length) % slides.length;

  slides.forEach((s, i) => s.classList.toggle("active", i === slideIndex));
  dots.forEach((d, i) => d.classList.toggle("active-dot", i === slideIndex));
}

function siguiente() { mostrarSlide(slideIndex + 1); }
function anterior() { mostrarSlide(slideIndex - 1); }

function filtrarCategoria(categoria) {
  const peliculas = document.querySelectorAll(".pelicula");
  peliculas.forEach(peli => {
    const categorias = peli.getAttribute("data-categoria")?.toLowerCase().split(",") || [];
    peli.style.display = categorias.includes(categoria.toLowerCase()) ? "inline-block" : "none";
  });
}

function mostrarTodasCategorias() {
  document.querySelectorAll(".pelicula").forEach(peli => {
    peli.style.display = "inline-block";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  paginarPeliculas();
  cargarCarrusel(); // Esto inicializa el carrusel
  setInterval(() => mostrarSlide(slideIndex + 1), 8000);
});
