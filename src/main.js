/**
 * Main entry point — initializes all components, sets up navigation
 */
import './styles/index.css';
import { initHero } from './components/hero.js';
import { initBlochSphere } from './components/blochSphere.js';
import { initGatesSimulator } from './components/gatesSimulator.js';
import { initSuperposition } from './components/superposition.js';
import { initEntanglement } from './components/entanglement.js';
import { initCircuitBuilder } from './components/circuitBuilder.js';

// ===== Initialize all components =====
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initBlochSphere();
  initGatesSimulator();
  initSuperposition();
  initEntanglement();
  initCircuitBuilder();
  initNavigation();
  initScrollAnimations();
});

// ===== Navigation =====
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('.section');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
    });
  });

  // Active section tracking
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

// ===== Scroll-triggered animations =====
function initScrollAnimations() {
  const animElements = document.querySelectorAll('.section-header, .glass-card, .bloch-canvas-wrap, .coin-container, .ent-visual');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animElements.forEach(el => observer.observe(el));
}
