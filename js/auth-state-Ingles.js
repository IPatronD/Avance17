// auth-state.js
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    // Evitar ejecución en páginas de login o registro
    if (currentPage.includes('iniciarSesionIngles.html') || currentPage.includes('registrateIngles.html')) {
        return; // No ejecutar menú ni logout en estas páginas
    }

    // Verificar estado de autenticación
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    // Actualizar menú de cuenta en todas las páginas
    updateAccountMenu(userEmail, userName);

    // Configurar logout
    setupLogout();
});

function updateAccountMenu(userEmail, userName) {
    const accountMenu = document.querySelector('.submenu');
    if (!accountMenu) return;

    const trigger = accountMenu.querySelector('.submenu-trigger');
    const options = accountMenu.querySelector('.submenu-opciones');

    const inHtmlFolder = window.location.pathname.includes('/htmlIngles/');

    const rutaIniciar = inHtmlFolder ? './iniciarSesionIngles.html' : './htmlIngles/iniciarSesionIngles.html';
    const rutaRegistro = inHtmlFolder ? './registrateIngles.html' : './htmlIngles/registrateIngles.html';

    // Detectar si el usuario recién se registró
    const esNuevo = localStorage.getItem('esUsuarioNuevo') === 'true';

    // Determinar a qué página de perfil dirigir según el estado
    const rutaPerfil = inHtmlFolder
        ? (esNuevo ? './bienvenidosPrimerIngles.html' : './bienvenidosIngles.html')
        : (esNuevo ? './htmlIngles/bienvenidosPrimerIngles.html' : './htmlIngles/bienvenidosIngles.html');

    const rutaLogout = inHtmlFolder ? './indexIngles.html' : './indexIngles.html'; // Asegura redirección correcta

    if (userEmail) {
        trigger.innerHTML = `${userName || 'My Account'} <span class="submenu-icon">▾</span>`;

        options.innerHTML = `
            <a href="${rutaPerfil}">My profile</a>
            <a href="${rutaLogout}" class="logout-btn">Sign out</a>
        `;
    } else {
        trigger.innerHTML = `My Account <span class="submenu-icon">▾</span>`;

        options.innerHTML = `
            <a href="${rutaIniciar}">Login</a>
            <a href="${rutaRegistro}">Register</a>
        `;
    }
}

function setupLogout() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('logout-btn')) {
            e.preventDefault();

            // Limpiar datos del usuario
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('estadoRegistro');
            localStorage.removeItem('esUsuarioNuevo');

            // Detectar si estamos dentro de /html/ para calcular bien la ruta
            const inHtmlFolder = window.location.pathname.includes('/htmlIngles/');
            const rutaIndex = inHtmlFolder ? './indexIngles.html' : './indexIngles.html';

            // Redirigir a la página principal
            window.location.href = rutaIndex;
        }
    });
}

// Protege redirecciones automáticas mientras se está registrando
firebase.auth().onAuthStateChanged((user) => {
    const estaRegistrando = localStorage.getItem('estadoRegistro');
    const esUsuarioNuevo = localStorage.getItem('esUsuarioNuevo');
    const currentPage = window.location.pathname;

    // Agrega los console.log para ver el estado de las variables
    console.log("Usuario autenticado:", user);
    console.log("Estado de registro (estadoRegistro):", estaRegistrando);
    console.log("Es usuario nuevo (esUsuarioNuevo):", esUsuarioNuevo);
    console.log("Página actual:", currentPage);

    // Evitar redirección si ya estamos en la página de login o registro
    if (currentPage.includes('iniciarSesionIngles.html') || currentPage.includes('registrateIngles.html')) {
        // Si está registrando, no redirigir, solo continuar
        if (estaRegistrando === 'en_progreso') {
            return;
        }
    }

    // Si no hay usuario y no estamos registrando, redirigir a iniciar sesión
    if (!user && estaRegistrando !== 'en_progreso') {
        const inHtmlFolder = window.location.pathname.includes('/htmlIngles/');
        const rutaIniciarSesion = inHtmlFolder ? './iniciarSesionIngles.html' : './htmlIngles/iniciarSesionIngles.html';
        window.location.href = rutaIniciarSesion;
    }

    // Si el usuario es nuevo y se registró correctamente, redirigir a la página de bienvenida
    if (user && esUsuarioNuevo === 'true') {
        localStorage.removeItem('esUsuarioNuevo'); // Limpiar el estado de usuario nuevo
        window.location.href = './bienvenidosPrimerIngles.html';
    }
});