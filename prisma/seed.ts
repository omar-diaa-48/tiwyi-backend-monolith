import { CorporateType, PrismaClient, StatusListType } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            id: 1
        }
    })

    const userEntity = await prisma.userEntity.create({
        data: {
            name: 'Settings',
            email: 'Settings',
            password: 'Settings',
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    const corporate = await prisma.corporate.upsert({
        where: {
            id: 1
        },
        create: {
            title: 'Settings',
            description: 'For settings purposes',
            corporateType: CorporateType.SETTINGS,
        },
        update: {}
    })

    const project = await prisma.project.upsert({
        where: {
            id: 1
        },
        create: {
            title: 'Settings',
            description: 'For settings purposes',
            budget: 0,
            corporate: {
                connect: {
                    id: corporate.id
                }
            },
            creatorId: userEntity.id
        },
        update: {}
    })

    const statusList = await prisma.statusList.upsert({
        where: {
            id: 1
        },
        create: {
            statusListType: StatusListType.SETTINGS,
            project: {
                connect: {
                    id: project.id
                }
            }
        },
        update: {}
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })