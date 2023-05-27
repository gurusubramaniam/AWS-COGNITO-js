import fs from 'fs'
import { DateTime } from 'luxon'
import PDFDocument from 'pdfkit'

import { Order } from '../../../types/order'
import { OrderState } from '../../../types/picking-state'
import { formatDeliveryMethod } from '../../../utils/format-texts'
import { hasAgeLimitedItems } from '../../../utils/orders-utils'
import { renderSvgToPdf } from '../../../utils/pdf'

const ICON_SNOWFLAKE_SMALL_SVG = fs.readFileSync('src/assets/icon-snowflake-small.svg', 'utf8')
const ICON_BOX_SVG = fs.readFileSync('src/assets/icon-box.svg', 'utf8')
const ICON_AGE_RESTRICTION_SVG = fs.readFileSync('src/assets/icon-age-restriction-24.svg', 'utf8')

interface Coordinate {
  x: number
  y: number
}

const name = (order: Order): string => {
  if (!order.customer) {
    return 'Ei nimeä'
  }

  const { lastName, firstName } = order.customer
  return lastName && firstName ? `${lastName.substr(0, 15)} ${firstName.substr(0, 1)}` : 'Ei nimeä'
}

const weekdays = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']
const deliveryDate = (order: Order): string => {
  const { deliveryDate } = order
  const formattedDate = DateTime.fromISO(deliveryDate).setLocale('fi-FI')

  return `${weekdays[formattedDate.weekday - 1]} ${formattedDate.toFormat('dd.MM')}`.toUpperCase()
}

export const deliverySticker = async (
  doc: typeof PDFDocument,
  order: Order,
  orderState: OrderState,
  qr: string,
  offset: Coordinate,
  roundName?: string,
): Promise<void> => {
  doc.font('Helvetica-Bold')

  console.log({ roundName })
  doc.font('Helvetica-Bold').fillColor('black')
  // Order number
  doc
    .fontSize(13)
    .text(`${order.orderNumber}`, 0 + offset.x, 0 + offset.y, { characterSpacing: 0.5 })

  // Round Number
  doc
    .fontSize(13)
    .text(`${roundName ?? ''}`, 68 + offset.x, 0 + offset.y, { characterSpacing: 0.5 })
  // Delivery method and time window
  doc
    .fontSize(13)
    .text(
      `${formatDeliveryMethod(order.deliveryMethod, { short: true })} ${order.deliveryTime}`,
      0 + offset.x,
      15 + offset.y,
    )

  // Date, name
  doc.font('Helvetica').fillColor('black')
  doc.fontSize(11).text(`${deliveryDate(order)}`, 0 + offset.x, 29 + offset.y)
  doc.fontSize(11).text(`${name(order)}`, 0 + offset.x, 40 + offset.y)

  // Tote icons

  const boxTotes = orderState.finalBoxAmount ?? 0
  const freezerBagTotes = orderState.finalFreezerBagAmount ?? 0

  if (boxTotes > 0) {
    renderSvgToPdf(doc, ICON_BOX_SVG, 1 + offset.x, 53 + offset.y)
    doc.fontSize(13).text(boxTotes.toString(), 22 + offset.x, 55 + offset.y, { lineBreak: false })
  }

  if (freezerBagTotes > 0) {
    renderSvgToPdf(doc, ICON_SNOWFLAKE_SMALL_SVG, 40 + offset.x, 53 + offset.y)
    doc
      .fontSize(13)
      .text(freezerBagTotes.toString(), 62 + offset.x, 55 + offset.y, { lineBreak: false })
  }

  if (hasAgeLimitedItems(orderState)) {
    renderSvgToPdf(doc, ICON_AGE_RESTRICTION_SVG, 75 + offset.x, 52 + offset.y)
  }

  // Order tag
  doc
    .fillColor('black')
    .rect(112 + offset.x, 0 + offset.y, 46, 20)
    .fill()

  // Order tag text
  doc
    .fontSize(16)
    .fillColor('white')
    .text(`${orderState.toteCode}`, 120 + offset.x, 5 + offset.y)

  // QR-code

  doc.image(qr, 113 + offset.x, 25 + offset.y, { width: 46, height: 46 })
}
