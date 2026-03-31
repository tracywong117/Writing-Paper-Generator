<script setup>
import { reactive, watch, onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import PaperCanvas from '../components/PaperCanvas.vue'
import { jsPDF } from 'jspdf'

const router = useRouter()

const settings = reactive({
  paperType: 'empty',
  spacing: 3,
  pageSize: 'A4',
  bgColor: 'custom',
  customBgColor: '#FAFAF5',
  lineColor: '#CCCCCC',
  customLineColor: '#CCCCCC',
  headerHeight: 20,
  redLine: false,
  redLinePadding: 20,
  titleSection: false,
  noField: false,
  dateField: false,
  footer: false,
  footerStart: 1,
  ruler: false,
})

const isSidebarOpen = ref(false)

const pageSizes = {
  'A4': [210, 297],
  'A5': [148, 210],
  'B5': [176, 250],
  'B6': [125, 176],
  'A6': [105, 148]
}

const defaultRedLinePadding = {
  'A4': 20,
  'A5': 15,
  'B5': 18,
  'B6': 12,
  'A6': 10
}

const activeBgColor = computed(() => {
  return settings.bgColor === 'custom' ? settings.customBgColor : settings.bgColor
})

const activeLineColor = computed(() => {
  return settings.lineColor === 'custom' ? settings.customLineColor : settings.lineColor
})

watch(() => settings.pageSize, (newSize) => {
  settings.redLinePadding = defaultRedLinePadding[newSize]
})

watch(() => settings.paperType, (newType) => {
  if (newType === 'line') {
    settings.spacing = 7
  } else {
    settings.spacing = 3
  }
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const generatePDF = () => {
  const [width, height] = pageSizes[settings.pageSize]
  const pdf = new jsPDF({
    orientation: width > height ? 'l' : 'p',
    unit: 'mm',
    format: settings.pageSize
  })

  const bgColor = activeBgColor.value
  pdf.setFillColor(bgColor)
  pdf.rect(0, 0, width, height, 'F')

  const lineColor = activeLineColor.value
  pdf.setDrawColor(lineColor)
  pdf.setLineWidth(0.1)

  const drawRulerLinePDF = (y, above) => {
    const markingInterval = 0.5
    const longMarkHeight = 0.5

    pdf.setLineWidth(0.2)
    pdf.line(0, y, width, y)

    for (let x = 0; x <= width; x += markingInterval) {
      const markCount = Math.round(x / markingInterval)
      const markHeight = (markCount % 10 === 0) ? longMarkHeight : 0

      if (markHeight > 0) {
        if (above) {
          pdf.line(x, y, x, y - markHeight)
        } else {
          pdf.line(x, y, x, y + markHeight)
        }
      }
    }
  }

  const drawLinesPDF = () => {
    let headerEnd = settings.headerHeight
    let currentY = headerEnd
    const spacing = settings.spacing

    if (settings.titleSection) {
      pdf.setLineWidth(0.2)
      pdf.line(0, currentY, width, currentY)
      currentY += 10

      if (settings.ruler) {
        drawRulerLinePDF(currentY, false)
      } else {
        pdf.line(0, currentY, width, currentY)
      }

      pdf.setLineWidth(0.1)
      currentY += spacing
    }

    if (settings.noField || settings.dateField) {
      pdf.setFontSize(8)
      pdf.setTextColor(lineColor)
      let fieldY = headerEnd - 10

      if (settings.noField) {
        pdf.text('No:', width - 50, fieldY)
        pdf.setLineDash([0.5, 0.5])
        pdf.line(width - 40, fieldY + 1, width - 5, fieldY + 1)
        pdf.setLineDash([])
      }

      if (settings.dateField) {
        fieldY += 6
        pdf.text('Date:', width - 50, fieldY)
        for (let i = 0; i < 2; i++) {
          const x = width - (40 - (i + 1) * 35 / 3)
          pdf.text('.', x, fieldY)
        }
      }
    }

    const totalLines = Math.floor((height - currentY) / spacing) + 1
    const footerLineIndex = settings.footer ? totalLines - settings.footerStart : totalLines

    for (let i = 0; i < totalLines; i++) {
      const y = currentY + i * spacing
      if (i === 0 && settings.footer && !settings.titleSection) {
        if (settings.ruler) {
          drawRulerLinePDF(y, false)
        } else {
          pdf.setLineWidth(0.2)
          pdf.line(0, y, width, y)
        }
      } else if (i < footerLineIndex) {
        pdf.setLineWidth(0.1)
        pdf.line(0, y, width, y)
      } else if (i === footerLineIndex && settings.footer) {
        if (settings.ruler) {
          drawRulerLinePDF(y, true)
        } else {
          pdf.setLineWidth(0.2)
          pdf.line(0, y, width, y)
        }
      }
    }

    if (settings.redLine) {
      pdf.setDrawColor('red')
      pdf.setLineWidth(0.1)
      const startY = settings.titleSection ? currentY - spacing : currentY
      pdf.line(settings.redLinePadding, startY, settings.redLinePadding, currentY + footerLineIndex * spacing)
      pdf.setDrawColor(lineColor)
    }
  }

  const drawGridPDF = () => {
    const spacing = settings.spacing
    for (let x = 0; x <= width; x += spacing) {
      pdf.line(x, 0, x, height)
    }
    for (let y = 0; y <= height; y += spacing) {
      pdf.line(0, y, width, y)
    }
  }

  const drawDotsPDF = () => {
    const spacing = settings.spacing
    pdf.setFillColor(lineColor)
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        pdf.circle(x, y, 0.2, 'F')
      }
    }
  }

  switch (settings.paperType) {
    case 'grid': drawGridPDF(); break
    case 'dot': drawDotsPDF(); break
    case 'line': drawLinesPDF(); break
  }

  pdf.save('writing_paper.pdf')
}

</script>

<template>
  <div class="container">
    <div 
      v-if="isSidebarOpen" 
      class="mobile-backdrop" 
      @click="toggleSidebar"
    ></div>
    <Sidebar 
      :settings="settings" 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
      @generate="generatePDF"
    />
    <div class="main-content">
      <div class="main-header">
        <div class="header-left">
          <button @click="router.push('/')" class="home-btn" title="Back to Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <button id="sidebarToggle" @click="toggleSidebar">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="var(--accent-color)" />
              <path d="M13 20H27M13 14H27M13 26H27" stroke="white" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="header-right">
          <a href="https://github.com/tracywong117/Writing-Paper-Generator" target="_blank" class="github-link" title="View on GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="canvas-wrapper">
        <PaperCanvas :settings="settings" :page-sizes="pageSizes" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.heading-serif {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.02em;
}

.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-app);
  position: relative;
  overflow-y: auto;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: min-content;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 40px;
  background-color: rgba(229, 229, 226, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  display: flex;
  align-items: center;
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

.home-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, transform 0.2s;
}

.home-btn:hover {
  color: var(--accent-color);
  transform: scale(1.1);
}

.mobile-backdrop {
  display: none;
}

#sidebarToggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .mobile-backdrop {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .main-header {
    padding: 15px 20px;
  }

  .canvas-wrapper {
    padding: 20px;
  }
}
</style>