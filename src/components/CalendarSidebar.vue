<script setup>
import { computed } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'generate'])

const currentYear = new Date().getFullYear()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
</script>

<template>
  <div class="sidebar" :class="{ open: isOpen }" id="sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title heading-serif">Settings</h1>
      <button class="mobile-close" @click="$emit('toggle')" aria-label="Close settings">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="control-section">
      <h2 class="heading-serif">Calendar</h2>
      <div class="control-group">
        <label for="calYear">Year</label>
        <input type="number" id="calYear" :min="currentYear - 5" :max="currentYear + 10" v-model.number="settings.year">
      </div>
      <div class="control-group">
        <label for="weekStart">Week Starts On</label>
        <select id="weekStart" v-model="settings.weekStart">
          <option value="monday">Monday</option>
          <option value="sunday">Sunday</option>
        </select>
      </div>
    </div>

    <div class="control-section">
      <h2 class="heading-serif">Options</h2>
      <div class="control-group checkbox-wrapper">
        <input type="checkbox" id="showHolidays" v-model="settings.showHolidays">
        <label for="showHolidays">Show HK Public Holidays</label>
      </div>
    </div>

    <div class="control-section">
      <h2 class="heading-serif">Preview</h2>
      <div class="control-group">
        <label for="previewMonth">Month</label>
        <select id="previewMonth" v-model.number="settings.previewMonth">
          <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">{{ name }}</option>
        </select>
      </div>
    </div>

    <button @click="$emit('generate')" class="generate-btn">
      <svg class="btn-icon" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <path d="M 191.378 67.090 C 163.832 70.304, 140.362 92.273, 134.583 120.254 C 132.181 131.881, 132.165 667.976, 134.566 679.792 C 138.610 699.697, 152.314 717.495, 170.496 726.457 C 185.770 733.986, 173.576 733.420, 327.941 733.761 C 404.084 733.930, 466.987 733.835, 467.726 733.552 C 468.831 733.127, 468.801 732.517, 467.558 730.112 C 459.922 715.346, 457.931 685.427, 463.391 667.500 C 472.604 637.251, 494.908 614.567, 524.919 604.922 L 533.500 602.164 534.074 575.332 C 534.618 549.870, 534.786 548.040, 537.369 539.500 C 548.568 502.463, 576.631 476.615, 613.884 469.024 C 622.042 467.361, 627.668 467, 645.407 467 L 667 467 667 377.958 C 667 300.637, 666.792 287.907, 665.417 281.254 C 663.470 271.827, 659.439 262.751, 653.603 254.654 C 646.429 244.701, 480.667 80.151, 473.742 76.108 C 465.537 71.318, 456.402 68.238, 446.838 67.039 C 436.840 65.785, 202.160 65.833, 191.378 67.090 M 434.234 197 L 434.500 276.500 437.195 281.608 C 440.551 287.970, 448.508 295.236, 454.756 297.645 C 459.140 299.335, 464.281 299.496, 522.500 299.768 C 557.150 299.930, 592.364 299.936, 600.754 299.781 L 616.008 299.500 524.988 208.500 L 433.967 117.500 434.234 197 M 351 334.879 C 328.637 342.206, 321.081 366.523, 330.042 402.328 C 334.288 419.293, 344.484 446.192, 351.191 458.126 L 353.241 461.773 349.473 473.137 C 345.096 486.337, 334.755 512.387, 329.877 522.500 C 326.622 529.248, 326.302 529.568, 321 531.400 C 273.689 547.741, 246.472 565.959, 236.641 587.865 C 229.214 604.415, 238.525 626.899, 254.761 631.619 C 280.646 639.144, 306.221 617.971, 338.251 562.500 C 344.554 551.584, 344.644 551.486, 350.051 549.652 C 358.876 546.658, 389.454 539.161, 395.739 538.450 L 401.534 537.794 406.494 543.147 C 425.077 563.201, 444.776 576.335, 460.334 579.044 C 478.452 582.200, 494.829 569.717, 498.989 549.580 C 504.871 521.113, 477.623 506.204, 426.500 509.915 L 412.500 510.931 410.500 508.504 C 407.181 504.477, 392.436 480.907, 387.148 471.175 L 382.194 462.057 384.637 454.365 C 395.240 420.976, 400.137 383.395, 396.087 366.500 C 393.020 353.705, 384.621 341.437, 375.791 336.856 C 371.156 334.451, 355.996 333.242, 351 334.879 M 623.314 534.792 C 615.972 537.422, 610.547 541.285, 606.504 546.765 C 600.008 555.570, 600 555.650, 600 613.586 L 600 665.808 573.250 666.225 C 543.506 666.688, 542.442 666.896, 534.905 673.705 C 526.932 680.908, 524.117 691.700, 527.496 702.112 C 529.131 707.150, 532.049 710.317, 572.372 750.823 C 596.093 774.651, 617.525 795.351, 620 796.823 C 625.805 800.276, 638.056 800.663, 644.500 797.597 C 650.765 794.615, 734.343 710.821, 736.857 705 C 742.982 690.819, 737.970 676.387, 724.531 669.510 L 718.648 666.500 L 693.074 666.500 L 667.500 666.500 L 667 612.500 L 666.500 558.500 L 663.906 553 C 656.673 537.666, 638.302 529.425, 623.314 534.792" fill="currentColor" fill-rule="evenodd"/>
      </svg>
      Generate PDF
    </button>
  </div>
</template>

<style scoped>
.sidebar {
  width: 320px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 40px 24px;
  overflow-y: auto;
  flex-shrink: 0;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.sidebar-title {
  font-size: 24px;
  margin-bottom: 0;
  font-weight: 500;
}

.mobile-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

.control-section {
  margin-bottom: 32px;
}

.control-section h2 {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.control-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

select,
input[type="number"],
input[type="color"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: transparent;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

select:focus,
input[type="number"]:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(156, 132, 112, 0.1);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: var(--accent-color);
}

.checkbox-wrapper label {
  margin-bottom: 0;
  cursor: pointer;
}

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin: 40px 0 20px 0;
  padding: 14px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  font-family: var(--font-body);
  transition: background-color 0.2s, transform 0.1s;
}

.btn-icon {
  width: 30px;
  height: 30px;
}

.generate-btn:hover {
  background-color: var(--accent-hover);
}

.generate-btn:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .sidebar {
    width: 300px;
    max-width: 85vw;
    position: fixed;
    top: 0;
    left: -320px;
    bottom: 0;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1001;
    height: 100vh;
    box-shadow: 10px 0 30px rgba(0,0,0,0.1);
  }

  .sidebar.open {
    transform: translateX(320px);
  }

  .mobile-close {
    display: flex;
  }
}
</style>
