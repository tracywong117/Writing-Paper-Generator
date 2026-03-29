<script setup>
import { reactive, watch, onMounted, ref, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import PaperCanvas from './components/PaperCanvas.vue'
import { jsPDF } from 'jspdf'

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
        <button id="sidebarToggle" @click="toggleSidebar">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="var(--accent-color)" />
            <path d="M13 20H27M13 14H27M13 26H27" stroke="white" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="canvas-wrapper">
        <PaperCanvas :settings="settings" :page-sizes="pageSizes" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --bg-app: #E5E5E2; /* Light Lead - Darker for contrast */
  --bg-sidebar: #FFFFFF; /* Fresh Sheet */
  --text-primary: #2D2D2A; /* Dried Ink */
  --text-muted: #7A7A72; /* Graphite */
  --border-color: #D1D1CD; /* Darker Lead */
  --accent-color: #9C8470; /* Taupe Stone */
  --accent-hover: #8A7360;
  --font-heading: 'Bodoni Moda', serif;
  --font-body: 'Jost', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  background-color: var(--bg-app);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  overflow: hidden; /* Prevent body scroll */
}

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
  padding: 20px 40px;
  background-color: rgba(229, 229, 226, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
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

@media (min-width: 769px) {
  .main-header {
    display: none;
  }
}
</style>