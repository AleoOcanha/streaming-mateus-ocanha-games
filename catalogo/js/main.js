import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const USER_TYPE_KEY = 'mateus_streaming_user_type';
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');
    const userType = localStorage.getItem(USER_TYPE_KEY) || 'visitante';
    const imagemPadrao = userType === 'inscrito'
        ? '../assets/perfil-inscrito.png'
        : '../assets/perfil-visitante.png';

    const resolverImagemPerfil = (imagem) => {
        if (!imagem) return imagemPadrao;
        if (imagem.includes('perfil-inscrito.png')) return '../assets/perfil-inscrito.png';
        if (imagem.includes('perfil-visitante.png')) return '../assets/perfil-visitante.png';
        return imagemPadrao;
    };

    const nomePadrao = userType === 'inscrito' ? 'Inscrito' : 'Visitante';
    const nomeFinal = nomePerfil || nomePadrao;
    const imagemFinal = resolverImagemPerfil(imagemPerfil);

    const kidsLink = document.querySelector('.kids-link');
    const profileIcon = document.querySelector('.profile-icon');

    if (kidsLink) kidsLink.textContent = nomeFinal;
    if (profileIcon) profileIcon.src = imagemFinal;

    const container = document.getElementById('main-content');
    
    if (container) {
        categories.forEach(category => {
            const carousel = createCarousel(category);
            container.appendChild(carousel);
        });
    }
});
