const root = document.documentElement;

/* Reveal vem primeiro: se qualquer coisa abaixo quebrar, o conteudo ja esta garantido. */
const revealables = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

  revealables.forEach((el) => observer.observe(el));
} else {
  /* Navegador sem suporte: mostra tudo de uma vez. Nao dá para remover a classe .js
     aqui, porque ela tambem controla o menu mobile — e o menu funciona normalmente. */
  revealables.forEach((el) => el.classList.add('visible'));
}

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menu && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  menu.addEventListener('click', () => setOpen(!nav.classList.contains('open')));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      menu.focus();
    }
  });
} else {
  /* Sem botao ou sem nav no DOM nao ha menu recolhivel: derruba o gate para
     a navegacao nao ficar inacessivel. */
  root.classList.remove('js');
}

/* Ultima linha de proposito: so chegamos aqui se reveal e menu ficaram de pe.
   A ausencia desta classe faz o failsafe do <head> remover .js no 'load'. */
root.classList.add('js-ready');

// Leva o foco ao destino, inclusive quando o menu acaba de ser recolhido.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});
