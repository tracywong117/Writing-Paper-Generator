<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  pageSizes: {
    type: Object,
    required: true
  }
})

const canvasRef = ref(null)

const drawRulerLine = (ctx, canvas, y, above) => {
  const markingInterval = 0.5 * 3.78
  const longMarkHeight = 2

  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(canvas.width, y)
  ctx.stroke()

  for (let x = 0; x <= canvas.width; x += markingInterval) {
    const markCount = Math.round(x / markingInterval)
    const markHeight = (markCount % 10 === 0) ? longMarkHeight : 0

    if (markHeight > 0) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      if (above) {
        ctx.lineTo(x, y - markHeight)
      } else {
        ctx.lineTo(x, y + markHeight)
      }
      ctx.stroke()
    }
  }
}

const drawPaper = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const { settings, pageSizes } = props

  const [width, height] = pageSizes[settings.pageSize]
  canvas.width = width * 3.78
  canvas.height = height * 3.78

  // Set background color
  const bgColor = settings.bgColor === 'custom' ? settings.customBgColor : settings.bgColor
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Set line color
  const lineColor = settings.lineColor === 'custom' ? settings.customLineColor : settings.lineColor
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 0.5

  const size = settings.spacing * 3.78

  if (settings.paperType === 'grid') {
    for (let x = 0; x <= canvas.width; x += size) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += size) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
    }
  } else if (settings.paperType === 'dot') {
    ctx.fillStyle = lineColor
    for (let x = size; x < canvas.width; x += size) {
      for (let y = size; y < canvas.height; y += size) {
        ctx.beginPath(); ctx.arc(x, y, 0.5, 0, 2 * Math.PI); ctx.fill()
      }
    }
  } else if (settings.paperType === 'line') {
    let headerEnd = settings.headerHeight * 3.78
    let currentY = headerEnd

    if (settings.titleSection) {
      ctx.lineWidth = 1
      ctx.strokeStyle = lineColor
      ctx.beginPath(); ctx.moveTo(0, currentY); ctx.lineTo(canvas.width, currentY); ctx.stroke()
      currentY += 10 * 3.78
      if (settings.ruler) {
        drawRulerLine(ctx, canvas, currentY, false)
      } else {
        ctx.beginPath(); ctx.moveTo(0, currentY); ctx.lineTo(canvas.width, currentY); ctx.stroke()
      }
      ctx.lineWidth = 0.5
      currentY += size
    }

    if (settings.noField || settings.dateField) {
      ctx.font = '10px Arial'
      ctx.fillStyle = lineColor
      let fieldY = headerEnd - 10 * 3.78
      if (settings.noField) {
        ctx.fillText('No:', canvas.width - 50 * 3.78, fieldY)
        ctx.save(); ctx.setLineDash([2, 2]); ctx.beginPath()
        ctx.moveTo(canvas.width - 40 * 3.78, fieldY + 2); ctx.lineTo(canvas.width - 5 * 3.78, fieldY + 2); ctx.stroke()
        ctx.restore()
      }
      if (settings.dateField) {
        fieldY += 6 * 3.78
        ctx.fillText('Date:', canvas.width - 50 * 3.78, fieldY)
        for (let i = 0; i < 2; i++) {
          const x = canvas.width - (40 - (i + 1) * 35 / 3) * 3.78
          ctx.fillText('.', x, fieldY)
        }
      }
    }

    const totalLines = Math.floor((canvas.height - currentY) / size) + 1
    const footerLineIndex = settings.footer ? totalLines - settings.footerStart : totalLines

    for (let i = 0; i < totalLines; i++) {
      const y = currentY + i * size
      if (i === 0 && settings.footer && !settings.titleSection) {
        if (settings.ruler) {
          drawRulerLine(ctx, canvas, y, false)
        } else {
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
        }
      } else if (i < footerLineIndex) {
        ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      } else if (i === footerLineIndex && settings.footer) {
        if (settings.ruler) {
          drawRulerLine(ctx, canvas, y, true)
        } else {
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
        }
      }
    }

    if (settings.redLine) {
      ctx.strokeStyle = 'red'; ctx.lineWidth = 0.5; ctx.beginPath()
      const startY = settings.titleSection ? currentY - size : currentY
      ctx.moveTo(settings.redLinePadding * 3.78, startY)
      ctx.lineTo(settings.redLinePadding * 3.78, currentY + footerLineIndex * size)
      ctx.stroke()
    }
  }
}

onMounted(() => {
  drawPaper()
})

watch(() => props.settings, () => {
  drawPaper()
}, { deep: true })
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid var(--border-color);
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  canvas {
    margin-top: 20px;
  }
}
</style>
