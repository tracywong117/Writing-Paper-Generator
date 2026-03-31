<script setup>
import { computed } from 'vue'
import { getHoliday } from '../data/holidays.js'

const props = defineProps({
  settings: { type: Object, required: true }
})

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

// Exact day data from reference (Monday-start)
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

const allDays = computed(() =>
  props.settings.weekStart === 'monday' ? allDaysMondayStart : allDaysSundayStart
)

// Two-page: left page gets first 4, right page gets last 3
const leftDays = computed(() => allDays.value.slice(0, 4))
const rightDays = computed(() => allDays.value.slice(4))

// Sunday column index (0-based in the 7-day week)
const sundayWeekIndex = computed(() =>
  props.settings.weekStart === 'monday' ? 6 : 0
)

/**
 * Build the 6-row calendar grid — exact logic from reference
 */
const calendarGrid = computed(() => {
  const year = props.settings.year
  const month = props.settings.previewMonth

  const firstDay = new Date(year, month - 1, 1)
  let startDay = firstDay.getDay()

  if (props.settings.weekStart === 'monday') {
    startDay = startDay === 0 ? 6 : startDay - 1
  }
  // else Sunday start: startDay is already correct (0=Sun)

  const currentDate = new Date(year, month - 1, 1)
  currentDate.setDate(1 - startDay)

  const rows = []
  for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      const dayOfWeek = currentDate.getDay()
      const d = {
        date: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === (month - 1),
        isSunday: dayOfWeek === 0,
        holiday: null
      }
      if (props.settings.showHolidays && d.isCurrentMonth) {
        d.holiday = getHoliday(currentDate.getFullYear(), currentDate.getMonth() + 1, d.date)
      }
      week.push(d)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    rows.push(week)
  }
  return rows
})

/**
 * Exact cell type logic from reference
 */
function getDayCellType(weekIndex, rowIndex, week) {
  const isFirstRow = rowIndex === 0
  const isLastRow = rowIndex === 5
  const isLastCellOfPage = isLastRow && (weekIndex === 3 || weekIndex === 6)
  const isLastColumn = weekIndex === 3 || weekIndex === 6
  const isNotCurrentMonth = !week[weekIndex].isCurrentMonth

  if (isLastCellOfPage) return 'type-4'
  if (isFirstRow && !isLastColumn) return 'type-2'
  if (isLastRow && isNotCurrentMonth) return week[weekIndex].date === 1 ? 'type-2' : 'type-3'
  return 'type-1'
}

/**
 * For one-page layout, adapted type logic (7 columns, no page split)
 */
function getSinglePageCellType(weekIndex, rowIndex, week) {
  const isFirstRow = rowIndex === 0
  const isLastRow = rowIndex === 5
  const isLastColumn = weekIndex === 6

  if (isLastRow && isLastColumn) return 'type-4'
  if (isFirstRow && !isLastColumn) return 'type-2'
  if (isLastRow && !week[weekIndex].isCurrentMonth) return week[weekIndex].date === 1 ? 'type-2' : 'type-3'
  return 'type-1'
}

const isTwoPage = computed(() => props.settings.layout === 'two-page')
</script>

<template>
  <!-- ==================== Two-page spread (exact reference layout) ==================== -->
  <div v-if="isTwoPage" class="planner-spread">
    <!-- LEFT PAGE: 4 columns -->
    <div class="page left-page">
      <!-- Headers -->
      <div
        v-for="(day, index) in leftDays"
        :key="'lh-' + index"
        class="header-cell"
        :class="{ 'type-4': index === 3 }"
        :style="{ gridColumn: index + 1, gridRow: 1 }"
      >
        <span class="header-ja">{{ day.ja }}</span>
        <span class="header-de">{{ day.de }}</span>
        <span class="header-en">{{ day.en }}</span>
      </div>

      <!-- Day cells -->
      <template v-for="(week, rowIndex) in calendarGrid" :key="'lr-' + rowIndex">
        <div
          v-for="i in 4"
          :key="'lc-' + rowIndex + '-' + (i - 1)"
          class="day-cell"
          :class="[
            getDayCellType(i - 1, rowIndex, week),
            { 'not-current-month': !week[i - 1].isCurrentMonth },
            { 'sunday-cell': week[i - 1].isSunday }
          ]"
          :style="{ gridColumn: i, gridRow: rowIndex + 2 }"
        >
          <span class="day-number">{{ week[i - 1].date }}</span>
          <span v-if="week[i - 1].holiday" class="holiday-name">{{ week[i - 1].holiday }}</span>
        </div>
      </template>
    </div>

    <!-- RIGHT PAGE: 4-column grid (3 day cols + 1 month info col) -->
    <div class="page right-page">
      <!-- Headers for days 5-7 -->
      <div
        v-for="(day, index) in rightDays"
        :key="'rh-' + index"
        class="header-cell"
        :class="{
          'sunday-header': day.en === 'Sunday',
          'type-4': index === 2
        }"
        :style="{ gridColumn: index + 1, gridRow: 1 }"
      >
        <span class="header-ja">{{ day.ja }}</span>
        <span class="header-de">{{ day.de }}</span>
        <span class="header-en">{{ day.en }}</span>
      </div>

      <!-- Month info container (column 4, row 1 span 3) — exact from reference -->
      <div class="month-info-container">
        <div class="m-num">{{ settings.previewMonth }}</div>
        <div class="m-name">{{ monthNames[settings.previewMonth - 1] }}</div>
        <div class="y-num">{{ settings.year }}</div>
      </div>

      <!-- Day cells for days 5-7 -->
      <template v-for="(week, rowIndex) in calendarGrid" :key="'rr-' + rowIndex">
        <div
          v-for="i in 3"
          :key="'rc-' + rowIndex + '-' + (i - 1)"
          class="day-cell"
          :class="[
            getDayCellType(4 + i - 1, rowIndex, week),
            { 'not-current-month': !week[4 + i - 1].isCurrentMonth },
            { 'sunday-cell': week[4 + i - 1].isSunday }
          ]"
          :style="{ gridColumn: i, gridRow: rowIndex + 2 }"
        >
          <span class="day-number">{{ week[4 + i - 1].date }}</span>
          <span v-if="week[4 + i - 1].holiday" class="holiday-name">{{ week[4 + i - 1].holiday }}</span>
        </div>
      </template>
    </div>
  </div>

  <!-- ==================== One-page landscape (same style, combined) ==================== -->
  <div v-else class="planner-single">
    <div class="page single-page">
      <!-- All 7 headers -->
      <div
        v-for="(day, index) in allDays"
        :key="'sh-' + index"
        class="header-cell"
        :class="{
          'sunday-header': day.en === 'Sunday',
          'type-4': index === 6
        }"
        :style="{ gridColumn: index + 1, gridRow: 1 }"
      >
        <span class="header-ja">{{ day.ja }}</span>
        <span class="header-de">{{ day.de }}</span>
        <span class="header-en">{{ day.en }}</span>
      </div>

      <!-- Month info (column 8, spanning rows 1-3) -->
      <div class="month-info-container single-month-info">
        <div class="m-num">{{ settings.previewMonth }}</div>
        <div class="m-name">{{ monthNames[settings.previewMonth - 1] }}</div>
        <div class="y-num">{{ settings.year }}</div>
      </div>

      <!-- All 7 day cells per row -->
      <template v-for="(week, rowIndex) in calendarGrid" :key="'sr-' + rowIndex">
        <div
          v-for="(d, colIndex) in week"
          :key="'sc-' + rowIndex + '-' + colIndex"
          class="day-cell"
          :class="[
            getSinglePageCellType(colIndex, rowIndex, week),
            { 'not-current-month': !d.isCurrentMonth },
            { 'sunday-cell': d.isSunday }
          ]"
          :style="{ gridColumn: colIndex + 1, gridRow: rowIndex + 2 }"
        >
          <span class="day-number">{{ d.date }}</span>
          <span v-if="d.holiday" class="holiday-name">{{ d.holiday }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/*
 * ============================================================
 * EXACT CSS from the reference calendar-generator/index.html
 * ============================================================
 */

/* The open notebook spread */
.planner-spread {
  display: flex;
  width: min(96%, calc((100vh - 160px) * (296 / 210)));
  max-width: 1600px;
  background: #fdfdf8;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

/* Each page is a 4-column grid */
.page {
  width: 50%;
  aspect-ratio: 148 / 210;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto repeat(6, 1fr);
  padding: 20px;
  gap: 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.left-page {
  border-right: 2px solid #ccc;
}

/* Headers — exact from reference */
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

/* Day cells — exact from reference */
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

/* Month info — exact from reference */
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

/* Holiday name inside day cell */
.holiday-name {
  font-size: 0.5rem;
  color: #c62828;
  line-height: 1.2;
  margin-top: 2px;
  font-weight: 500;
}

/*
 * ============================================================
 * One-page landscape adaptations
 * ============================================================
 */
.planner-single {
  display: flex;
  justify-content: center;
  width: min(96%, calc((100vh - 160px) * (296 / 210)));
  max-width: 1600px;
}

.single-page {
  width: 100%;
  aspect-ratio: 296 / 210;
  grid-template-columns: repeat(7, 1fr) auto;
  background: #fdfdf8;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.single-month-info {
  grid-column: 8;
  grid-row: 1 / span 3;
}

/* Responsive */
@media (max-width: 768px) {
  .planner-spread,
  .planner-single {
    width: 100%;
  }
}
</style>
