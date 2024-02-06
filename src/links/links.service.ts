import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Link } from '@prisma/client'
import { LinkDto } from './dto/url.dto'
import axios from 'axios'

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Link[]> {
    const links = await this.prisma.link.findMany()
    if (links.length === 0) throw new NotFoundException('No se encuentra ningun link')
    return links
  }

  async createUrlShort(body: LinkDto, param: string, user: any): Promise<Link> {
    const { urlOriginal } = body

    //if (urlOriginal === '' || urlOriginal === undefined) throw new BadRequestException('La url no puede ser vacia')
    if (!urlOriginal) throw new BadRequestException('La url no puede ser vacia')

    //Busca que exista el link con la url original y si existe la retorna
    const link = await this.prisma.link.findUnique({
      where: {
        url_original: urlOriginal,
      },
    })

    if (link) {
      return link
    }
    const urlShort = param || Math.random().toString(36).substring(2, 8)
    const userId = user?.sub

    //Crea un nuevo link con la url original, la url corta y la visita por defecto en 1
    const newLink = await this.prisma.link.create({
      data: {
        url_original: urlOriginal,
        url_short: urlShort,
        visits: 1,
        userId,
      },
    })

    return newLink
  }

  async redirectToOriginalUrl(urlShort: string): Promise<Link | null> {
    const link = await this.prisma.link.findFirst({
      where: {
        url_short: urlShort,
      },
    })

    if (!link) {
      throw new NotFoundException('No se encuentra ningun link con ese codigo')
    }

    return link
  }

  async updateVisits(link: Link, ipAddress: string | string[]) {
    await this.prisma.link.update({
      where: {
        url_short: link.url_short,
      },
      data: {
        visits: { increment: 1 },
      },
    })

    const newCountryName: string = await this.getCountry(ipAddress)
    const country = await this.prisma.country.findUnique({
      where: {
        name: newCountryName,
      },
    })

    if (!country) {
      await this.prisma.country.create({
        data: {
          name: newCountryName,
          links: {
            create: [
              {
                visits: 1,
                link: { connect: { id: link.id } },
              },
            ],
          },
        },
      })
    } else {
      await this.prisma.linkCountry.upsert({
        create: {
          linkId: link.id,
          countryId: country.id,
        },
        update: {
          visits: { increment: 1 },
        },
        where: {
          linkId_countryId: {
            linkId: link.id,
            countryId: country.id,
          },
        },
      })
    }
  }

  async getCountry(ipAddress: string | string[]) {
    try {
      const response = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.API_KEY_IP}&ip_address=${ipAddress}`)
      return response.data.country
    } catch (error) {
      console.error(error)
      return 'Unknown'
    }
  }

  async getAllCountry(urlShort: string) {
    const link = await this.prisma.link.findFirst({
      where: {
        url_short: urlShort,
      },
    })
    if (!link) return

    const linkCountries = await this.prisma.linkCountry.findMany({
      include: {
        country: {
          select: {
            name: true,
          },
        },
      },
      where: {
        linkId: link.id,
      },
    })

    return linkCountries
  }
}
