import { faker } from '@faker-js/faker'
import { db } from './index'
import { customers, tickets } from './schema'

const REPAIR_TITLES = [
  'Screen Repair',
  'Battery Replacement',
  'Virus Removal',
  'Data Recovery',
  'Keyboard Fix',
  'RAM Upgrade',
  'OS Installation',
  'General Diagnosis',
] as const

const REPAIR_DESCRIPTIONS: Record<string, string> = {
  'Screen Repair': 'Customer reports cracked or unresponsive display. Physical replacement required.',
  'Battery Replacement': 'Device battery drains rapidly or does not hold charge. Full replacement required.',
  'Virus Removal': 'Multiple pop-ups, browser redirects, and degraded performance. Malware suspected.',
  'Data Recovery': 'Storage drive making clicking sounds or not detected. Critical data must be recovered.',
  'Keyboard Fix': 'Several keys not responding. Possible debris or hardware connection failure.',
  'RAM Upgrade': 'Device runs slowly with multiple apps open. RAM upgrade consultation and installation.',
  'OS Installation': 'Fresh operating system installation requested. No data preservation needed.',
  'General Diagnosis': 'Device malfunctioning in unspecified ways. Full diagnostic needed to identify root cause.',
}

const TECHS = ['demo@repairshop.com', 'Alex Martinez'] as const

function daysAgo(maxDays: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * maxDays))
  return d
}

export async function seedDatabase() {
  console.log('🧹 Clearing existing data...')
  await db.delete(tickets)
  await db.delete(customers)

  console.log('📝 Inserting 25 customers...')
  const customerValues = Array.from({ length: 25 }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address1: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true } as Parameters<typeof faker.location.state>[0]),
    zip: faker.location.zipCode(),
    country: 'US',
    active: true,
    createdAt: daysAgo(180),
  }))

  const insertedCustomers = await db.insert(customers).values(customerValues).returning()
  console.log(`✅ Inserted ${insertedCustomers.length} customers`)

  console.log('🎫 Inserting 40 tickets...')
  const ticketValues = Array.from({ length: 40 }, (_, i) => {
    const title = REPAIR_TITLES[i % REPAIR_TITLES.length]
    const completed = i < 18
    const customer = insertedCustomers[i % insertedCustomers.length]
    return {
      customerId: customer.id,
      title,
      description: REPAIR_DESCRIPTIONS[title],
      completed,
      tech: TECHS[i % 2],
      createdAt: daysAgo(90),
    }
  })

  const insertedTickets = await db.insert(tickets).values(ticketValues).returning()
  console.log(`✅ Inserted ${insertedTickets.length} tickets`)

  console.log('🎉 Database seeding completed!')
  return { customers: insertedCustomers, tickets: insertedTickets }
}

export async function clearDatabase() {
  console.log('🧹 Clearing database...')
  await db.delete(tickets)
  await db.delete(customers)
  console.log('🎉 Database cleared!')
}
