<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isVisible = ref(false)
const fullText = "The architect’s tool for the writer’s soul. Precision-crafted digital stationery designed to be printed, touched, and lived in."
const displayedText = ref("")

onMounted(() => {
  isVisible.value = true
  typeText()
})

const typeText = () => {
  let i = 0
  const timer = setInterval(() => {
    displayedText.value += fullText[i]
    i++
    if (i >= fullText.length) clearInterval(timer)
  }, 50)
}

const categories = [
  {
    id: '01',
    title: 'Writing Paper',
    description: 'Precision-ruled lines, dots, and grids for focused notes and calligraphy.',
    active: true,
    path: '/writing-paper',
    type: 'line'
  },
  {
    id: '02',
    title: 'Lunar Calendar',
    description: 'Minimalist monthly and weekly views designed for chronological clarity.',
    active: true,
    path: '/lunar-calendar',
    type: 'grid'
  },
  {
    id: '03',
    title: 'Daily Planner',
    description: 'Time-blocked layouts to architect your day with intentionality.',
    active: false,
    type: 'planner'
  },
  {
    id: '04',
    title: 'Reflective Diary',
    description: 'Expansive, open spaces for journaling and morning pages.',
    active: false,
    type: 'empty'
  },
  {
    id: '05',
    title: 'Habit Tracking',
    description: 'Visual systems to monitor your progress and stay consistent.',
    active: false,
    type: 'tracking'
  }
]

const navigateTo = (cat) => {
  if (cat.active) {
    router.push(cat.path)
  }
}
</script>

<template>
  <div class="landing-page" :class="{ 'is-visible': isVisible }">
    <!-- Brand Header -->
    <nav class="brand-nav fade-in-down">
      <div class="brand-logo-group">
        <img src="/favicon.svg" alt="MusePaper logo" class="brand-logo" />
        <span class="brand-name heading-serif">MusePaper</span>
      </div>
      <div class="nav-right">
        <a href="https://github.com/tracywong117/Writing-Paper-Generator" target="_blank" class="github-link" title="View on GitHub">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
        </a>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="heading-serif fade-in-down">Design Your Focus.</h1>
        <p class="hero-subtitle">
          {{ displayedText }}<span class="cursor">|</span>
        </p>
        <div class="hero-actions fade-in-up delay-1">
          <button @click="router.push('/writing-paper')" class="cta-primary">Create Your First Sheet</button>
          <button class="cta-secondary" @click="document.getElementById('explore').scrollIntoView({behavior: 'smooth'})">Explore Collection</button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="detailed-features">
      <div class="feature-column fade-in-up delay-2">
        <div class="feature-number">01</div>
        <h3 class="heading-serif">Architectural Precision</h3>
        <p>Every line and dot is calibrated to the millimeter. Our generator ensures your layouts align perfectly with ISO paper standards (A4, A5, B5) for professional results.</p>
      </div>
      <div class="feature-column fade-in-up delay-2">
        <div class="feature-number">02</div>
        <h3 class="heading-serif">Paper-First Aesthetics</h3>
        <p>Curated ivory and neutral palettes designed to reduce eye strain. We prioritize the tactile feel of physical paper, ensuring your digital designs look timeless once printed.</p>
      </div>
      <div class="feature-column fade-in-up delay-2">
        <div class="feature-number">03</div>
        <h3 class="heading-serif">Unrestricted Freedom</h3>
        <p>No rigid templates. Complete control over spacing, margins, and headers. MusePaper adapts to your unique workflow, not the other way around.</p>
      </div>
    </section>

    <!-- Categories Grid -->
    <section id="explore" class="collection-section">
      <div class="section-header fade-in-up delay-3">
        <h2 class="heading-serif">Choose Your Canvas</h2>
        <p class="section-subtitle">Select a base to begin your design process.</p>
      </div>
      
      <div class="collection-grid">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          class="collection-item" 
          :class="{ 'is-active': cat.active, 'fade-in-up': true, 'delay-3': true }"
          @click="navigateTo(cat)"
        >
          <div class="paper-preview" :class="cat.type">
            <!-- Simulated Paper Preview -->
            <div class="paper-lines" v-if="cat.type === 'line'"></div>
            <div class="paper-grid" v-if="cat.type === 'grid'"></div>
            <div class="paper-empty" v-if="cat.type === 'empty'"></div>
            <div class="paper-dots" v-if="cat.type === 'tracking'"></div>
          </div>
          <div class="item-info">
            <span class="item-id">{{ cat.id }}</span>
            <h3 class="heading-serif">{{ cat.title }}</h3>
            <p>{{ cat.description }}</p>
            <div class="item-footer">
              <span v-if="!cat.active" class="coming-soon">Coming Soon</span>
              <span v-else class="start-btn">Open Designer →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Philosophy Section -->
    <!-- <section class="philosophy-section fade-in-up delay-4">
      <div class="philosophy-content">
        <span class="philosophy-label">The Philosophy</span>
        <h2 class="heading-serif quote-text">"The page is where chaos meets order."</h2>
        <p class="quote-sub">Digital tools often clutter the mind. MusePaper was built to clear it. Start with a clean sheet, designed by you, for the work that matters most.</p>
        <button @click="router.push('/writing-paper')" class="cta-primary outline">Launch Generator</button>
      </div>
    </section> -->

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <!-- <img src="/favicon.svg" alt="MusePaper logo" class="brand-logo" /> -->
          <span class="brand-name heading-serif">MusePaper</span>
        </div>
        <p class="footer-note">Designed for those who still believe in the power of the paper.</p>
        <div class="footer-social">
          <a href="https://github.com/tracywong117" target="_blank" class="social-link" title="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          <a href="mailto:tracywong117@gmail.com" class="social-link" title="Email">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </a>
        </div>
        <p class="copyright">© 2026 MusePaper Studio. Open Source & Free.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  background-color: var(--bg-app);
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.landing-page.is-visible {
  opacity: 1;
}

/* Nav */
.brand-nav {
  padding: 40px 60px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-name {
  font-size: 24px;
  letter-spacing: 0.05em;
  color: var(--text-primary);
}

.brand-logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.github-link {
  color: var(--text-muted);
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}

.github-link:hover {
  color: var(--accent-color);
  transform: scale(1.1);
}

/* Hero */
.hero {
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: linear-gradient(rgba(250, 250, 245, 0.75), rgba(250, 250, 245, 0.75)), url('/hero-bg.png');
  background-size: cover;
  background-position: center;
  padding: 0 20px;
}

.hero h1 {
  font-size: 96px;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 22px;
  color: var(--text-muted);
  max-width: 700px;
  margin: 32px auto;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.cta-primary {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 20px 48px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 20px 48px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-primary:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
}

.cta-secondary:hover {
  background-color: white;
  border-color: var(--accent-color);
}

/* Detailed Features */
.detailed-features {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 60px;
  gap: 80px;
  background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/feature-bg.png');
  background-size: cover;
}

.feature-column {
  flex: 1;
}

.feature-number {
  font-family: var(--font-heading);
  font-size: 14px;
  color: var(--accent-color);
  margin-bottom: 24px;
  display: block;
}

.feature-column h3 {
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.feature-column p {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 16px;
}

/* Collection Section */
.collection-section {
  padding: 120px 60px;
  background-color: #fbfbfb;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-header h2 {
  font-size: 48px;
  margin-bottom: 16px;
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 18px;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.collection-item {
  background: white;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: default;
}

.collection-item.is-active {
  cursor: pointer;
}

.collection-item.is-active:hover {
  transform: translateY(-10px);
  border-color: var(--accent-color);
  box-shadow: 0 30px 60px rgba(0,0,0,0.05);
}

.paper-preview {
  height: 240px;
  background-color: #FAFAF5;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  padding: 30px;
}

/* CSS Paper Patterns */
.paper-lines {
  height: 100%;
  background-image: repeating-linear-gradient(#e5e5e2 0 1px, transparent 1px 24px);
}

.paper-grid {
  height: 100%;
  background-image: 
    linear-gradient(#e5e5e2 1px, transparent 1px),
    linear-gradient(90deg, #e5e5e2 1px, transparent 1px);
  background-size: 20px 20px;
}

.paper-dots {
  height: 100%;
  background-image: radial-gradient(#e5e5e2 1px, transparent 1px);
  background-size: 20px 20px;
}

.item-info {
  padding: 40px;
}

.item-id {
  font-size: 12px;
  color: var(--accent-color);
  margin-bottom: 12px;
  display: block;
}

.item-info h3 {
  font-size: 24px;
  margin-bottom: 16px;
}

.item-info p {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 32px;
}

.item-footer {
  margin-top: auto;
}

.coming-soon {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: #f5f5f5;
  padding: 6px 12px;
  color: var(--text-muted);
}

.start-btn {
  font-weight: 600;
  color: var(--accent-color);
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.05em;
}

/* Final CTA */
.final-cta {
  text-align: center;
  padding: 160px 20px;
  background-color: var(--text-primary);
  color: white;
}

.final-cta h2 {
  font-size: 48px;
  margin-bottom: 24px;
}

.final-cta p {
  font-size: 20px;
  opacity: 0.8;
  margin-bottom: 48px;
}

/* Footer */
.landing-footer {
  padding: 80px 60px;
  background-color: white;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content .brand-name {
  display: block;
  margin-bottom: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-note {
  color: var(--text-muted);
  font-size: 16px;
  margin-bottom: 32px;
}

.copyright {
  font-size: 13px;
  color: var(--text-muted);
  opacity: 0.6;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.social-link {
  color: var(--text-muted);
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}

.social-link:hover {
  color: var(--accent-color);
  transform: scale(1.1);
}

.social-text {
  color: var(--text-muted);
  font-size: 14px;
}

/* Animations */
.fade-in-down { animation: fadeInDown 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.fade-in-up { animation: fadeInUp 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }
.delay-4 { animation-delay: 0.8s; }

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .hero h1 { font-size: 72px; }
  .detailed-features { flex-direction: column; gap: 60px; }
  .collection-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hero h1 { font-size: 48px; }
  .brand-nav { padding: 30px 20px; }
  .hero-actions { flex-direction: column; }
  .detailed-features { padding: 80px 20px; }
  .collection-section { padding: 80px 20px; }
}
</style>
