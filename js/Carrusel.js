/**
 * Configura el carrusel automático
 */
function setupCarrusel() {
  const track = document.querySelector('.slide-track');
  const contenedor = document.querySelector('.carrusel-contenedor');
  let offset = 0;
  let animationFrame = null;

  // Duplicar contenido para efecto infinito
  track.innerHTML += track.innerHTML;

  const totalWidth = track.scrollWidth;

  function animate() {
    offset += 2;
    track.style.transform = `translateX(-${offset}px)`;
    
    // Cuando el offset supera la mitad del contenido, reajustamos sin que el usuario lo note
    if (offset >= totalWidth / 2) {
      offset -= totalWidth / 2;
      track.style.transform = `translateX(-${offset}px)`;
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationFrame) animationFrame = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  startAnimation();

  // Pausar al pasar el mouse
  contenedor.addEventListener('mouseenter', stopAnimation);
  contenedor.addEventListener('mouseleave', startAnimation);
}


/**
 * Configura el lightbox para imágenes
 */
// Obtener elementos del lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close-btn');

// Delegación de eventos para abrir el lightbox
document.addEventListener('click', function (e) {
  const trigger = e.target.closest('.lightbox-trigger');
  if (trigger) {
    e.preventDefault();
    lightbox.classList.add('active');

    const img = trigger.querySelector('img');
    if (img) {
      lightboxImg.src = img.src; // tomar el src directo
      lightboxCaption.textContent = img.alt; // tomar el alt
    } else {
      // fallback: si no encuentra la img
      lightboxImg.src = trigger.getAttribute('href');
      lightboxCaption.textContent = '';
    }
  }
});

// Cerrar lightbox con el botón cerrar
closeBtn.addEventListener('click', function () {
  lightbox.classList.remove('active');
});

// Cerrar haciendo click fuera de la imagen
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

// Cerrar con la tecla ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    lightbox.classList.remove('active');
  }
});