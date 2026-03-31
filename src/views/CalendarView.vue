<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CalendarSidebar from '../components/CalendarSidebar.vue'
import CalendarPreview from '../components/CalendarPreview.vue'
import { getHoliday } from '../data/holidays.js'

const router = useRouter()
const now = new Date()

const settings = reactive({
  year: now.getFullYear(),
  weekStart: 'monday',
  layout: 'two-page',
  showHolidays: true,
  previewMonth: now.getMonth() + 1
})

const isSidebarOpen = ref(false)
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

// Exact day data from reference — trilingual
const allDaysMondayStart = [
  { ja: '月', de: 'Montag', en: 'Monday' },
  { ja: '火', de: 'Dienstag', en: 'Tuesday' },
  { ja: '水', de: 'Mittwoch', en: 'Wednesday' },
  { ja: '木', de: 'Donnerstag', en: 'Thursday' },
  { ja: '金', de: 'Freitag', en: 'Friday' },
  { ja: '土', de: 'Samstag', en: 'Saturday' },
  { ja: '日', de: 'Sonntag', en: 'Sunday' }
]
const allDaysSundayStart = [
  { ja: '日', de: 'Sonntag', en: 'Sunday' },
  { ja: '月', de: 'Montag', en: 'Monday' },
  { ja: '火', de: 'Dienstag', en: 'Tuesday' },
  { ja: '水', de: 'Mittwoch', en: 'Wednesday' },
  { ja: '木', de: 'Donnerstag', en: 'Thursday' },
  { ja: '金', de: 'Freitag', en: 'Friday' },
  { ja: '土', de: 'Samstag', en: 'Saturday' }
]

// ============================================================
// PDF generation: exact same approach as the reference.
// Build the identical HTML/CSS, open in a new window, window.print().
// ============================================================

// The EXACT CSS from the reference file, verbatim
const PRINT_CSS = `
* { box-sizing: border-box; }

body {
  background: white;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.planner-spread {
  display: flex;
  width: 296mm;
  background: #fdfdf8;
}

.page {
  width: 148mm;
  height: 210mm;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto repeat(6, 1fr);
  padding: 20px;
  gap: 0;
}

.left-page {
  border-right: 2px solid #ccc;
}

.header-cell {
  padding: 15px 10px 0px 10px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #1a4b8c;
  border-bottom: 0.075rem solid #1a4b8c;
  text-align: left;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.header-ja {
  font-size: 1rem;
  line-height: 1;
  letter-spacing: 0.04em;
}

.header-en {
  font-size: 0.8rem;
  line-height: 1;
  letter-spacing: 0.08em;
}

.header-de {
  font-size: 0.8rem;
  line-height: 1;
  letter-spacing: 0.08em;
}

.header-cell.sunday-header .header-ja,
.header-cell.sunday-header .header-de,
.header-cell.sunday-header .header-en {
  color: #c62828;
}

.day-cell {
  border-top: 0.075rem solid #1a4b8c;
  border-left: 0.075rem solid #1a4b8c;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 10px;
}

.day-cell.type-2 {
  margin-right: 0;
}

.day-cell.type-3 {
  margin-right: 0;
  border-left: none;
}

.day-cell.type-4 {
  border-left: none;
  margin-right: 10px;
}

.header-cell.type-4 {
  border-left: none;
  margin-right: 10px;
}

.day-number {
  font-size: 1rem;
  font-weight: bold;
  color: #1a4b8c;
}

.not-current-month .day-number {
  color: #c0c0c0;
}

.day-cell.sunday-cell .day-number {
  color: #c62828;
}

.day-cell.not-current-month .day-number {
  color: transparent;
}

.month-info-container {
  grid-column: 4;
  grid-row: 1 / span 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  text-align: center;
}

.month-info-container .m-num {
  font-size: 4rem;
  font-weight: bold;
  color: #1a4b8c;
  line-height: 1;
}

.month-info-container .m-name {
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #1a4b8c;
  margin-top: 5px;
  font-weight: bold;
}

.month-info-container .y-num {
  font-size: 1.2rem;
  color: #1a4b8c;
  margin-top: 2px;
  font-weight: bold;
}

.holiday-name {
  font-size: 0.5rem;
  color: #c62828;
  line-height: 1.2;
  margin-top: 2px;
  font-weight: 500;
}

@page {
  size: A5;
  margin: 0;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
  }
  .planner-spread {
    display: block;
    box-shadow: none;
    width: 148mm;
    max-width: none;
  }
  .page {
    width: 148mm;
    height: 210mm;
    padding: 20px;
    page-break-after: always;
    break-after: always;
    border: none !important;
  }
}
`

/**
 * Generate the HTML for a single month spread.
 * This is a direct port of the reference's generateCalendar() function,
 * producing the exact same DOM structure.
 */
function generateMonthHTML(year, month) {
  const allDays = settings.weekStart === 'monday' ? allDaysMondayStart : allDaysSundayStart
  const leftDays = allDays.slice(0, 4)
  const rightDays = allDays.slice(4)

  // ---- Date calculation: exact copy from reference ----
  const firstDay = new Date(year, month - 1, 1)
  let startDay = firstDay.getDay()
  if (settings.weekStart === 'monday') {
    startDay = startDay === 0 ? 6 : startDay - 1
  }
  const currentDate = new Date(year, month - 1, 1)
  currentDate.setDate(1 - startDay)

  // ---- Left page headers: exact copy from reference ----
  let leftPageHTML = ''
  leftDays.forEach((day, index) => {
    const cls = `header-cell${index === 3 ? ' type-4' : ''}`
    leftPageHTML += `<div class="${cls}" style="grid-column:${index + 1};grid-row:1"><span class="header-ja">${day.ja}</span><span class="header-de">${day.de}</span><span class="header-en">${day.en}</span></div>`
  })

  // ---- Right page headers: exact copy from reference ----
  let rightPageHTML = ''
  rightDays.forEach((day, index) => {
    const cls = `header-cell${index === 2 ? ` ${day.en === 'Sunday' ? 'sunday-header ' : ''}type-4` : (day.en === 'Sunday' ? ' sunday-header' : '')}`
    rightPageHTML += `<div class="${cls}" style="grid-column:${index + 1};grid-row:1"><span class="header-ja">${day.ja}</span><span class="header-de">${day.de}</span><span class="header-en">${day.en}</span></div>`
  })

  // ---- Month info: exact copy from reference ----
  rightPageHTML += `<div class="month-info-container"><div class="m-num">${month}</div><div class="m-name">${monthNames[month - 1]}</div><div class="y-num">${year}</div></div>`

  // ---- 6 rows of day cells: exact copy from reference ----
  for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
    const currentWeek = []
    for (let j = 0; j < 7; j++) {
      currentWeek.push({
        date: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === (month - 1),
        isSunday: currentDate.getDay() === 0
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const isFirstRow = rowIndex === 0
    const isLastRow = rowIndex === 5

    // Exact getDayCellType from reference
    const getDayCellType = (weekIndex) => {
      const isLastCellOfPage = isLastRow && (weekIndex === 3 || weekIndex === 6)
      const isLastColumn = weekIndex === 3 || weekIndex === 6
      const isNotCurrentMonth = !currentWeek[weekIndex].isCurrentMonth

      if (isLastCellOfPage) return 'type-4'
      if (isFirstRow && !isLastColumn) return 'type-2'
      if (isLastRow && isNotCurrentMonth) return currentWeek[weekIndex].date === 1 ? 'type-2' : 'type-3'
      return 'type-1'
    }

    // Left page cells (indices 0-3) — exact from reference
    for (let i = 0; i < 4; i++) {
      const cellType = getDayCellType(i)
      const sundayClass = currentWeek[i].isSunday ? ' sunday-cell' : ''
      const notCurrent = !currentWeek[i].isCurrentMonth ? ' not-current-month' : ''
      let content = `<span class="day-number">${currentWeek[i].date}</span>`
      if (settings.showHolidays && currentWeek[i].isCurrentMonth) {
        const hol = getHoliday(year, month, currentWeek[i].date)
        if (hol) content += `<span class="holiday-name">${hol}</span>`
      }
      leftPageHTML += `<div class="day-cell ${cellType}${sundayClass}${notCurrent}" style="grid-column:${i + 1};grid-row:${rowIndex + 2}">${content}</div>`
    }

    // Right page cells (indices 4-6) — exact from reference
    for (let i = 4; i < 7; i++) {
      const cellType = getDayCellType(i)
      const sundayClass = currentWeek[i].isSunday ? ' sunday-cell' : ''
      const notCurrent = !currentWeek[i].isCurrentMonth ? ' not-current-month' : ''
      let content = `<span class="day-number">${currentWeek[i].date}</span>`
      if (settings.showHolidays && currentWeek[i].isCurrentMonth) {
        const hol = getHoliday(year, month, currentWeek[i].date)
        if (hol) content += `<span class="holiday-name">${hol}</span>`
      }
      rightPageHTML += `<div class="day-cell ${cellType}${sundayClass}${notCurrent}" style="grid-column:${(i - 4) + 1};grid-row:${rowIndex + 2}">${content}</div>`
    }
  }

  return `<div class="planner-spread"><div class="page left-page">${leftPageHTML}</div><div class="page right-page">${rightPageHTML}</div></div>`
}

function generatePDF() {
  // Build all 12 months
  let allMonthsHTML = ''
  for (let m = 1; m <= 12; m++) {
    allMonthsHTML += generateMonthHTML(settings.year, m)
  }

  // Open print window with exact reference HTML/CSS
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to generate the PDF.')
    return
  }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Calendar ${settings.year}</title>
<style>${PRINT_CSS}</style>
</head>
<body>${allMonthsHTML}</body>
</html>`)
  printWindow.document.close()

  // Wait for render, then trigger print
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
  }
  // Fallback if onload doesn't fire (some browsers)
  setTimeout(() => {
    printWindow.focus()
    printWindow.print()
  }, 500)
}
</script>

<template>
  <div class="container">
    <div
      v-if="isSidebarOpen"
      class="mobile-backdrop"
      @click="toggleSidebar"
    ></div>
    <CalendarSidebar
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
        <CalendarPreview :settings="settings" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
