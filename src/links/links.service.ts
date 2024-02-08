import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Link } from '@prisma/client'
import { LinkDto } from './dto/url.dto'
import { CountryDto } from './dto/country.dto'
import { Request } from 'express'

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Link[]> {
    const links = await this.prisma.link.findMany()
    if (links.length === 0) throw new NotFoundException('No se encuentra ningun link')
    return links
  }

  async createUrlShort(body: LinkDto, param: string): Promise<Link> {
    const { urlOriginal } = body

    if (!urlOriginal) throw new BadRequestException('La url no puede ser vacia')

    const link = await this.prisma.link.findUnique({
      where: {
        url_original: urlOriginal,
      },
    })

    if (link) {
      return link
    }
    const urlShort = param || Math.random().toString(36).substring(2, 8)

    const newLink = await this.prisma.link.create({
      data: {
        url_original: urlOriginal,
        url_short: urlShort,
        visits: 0,
      },
    })

    return newLink
  }

  async redirectToOriginalUrl(short_url: string, req: Request): Promise<Link | null> {
    const link = await this.prisma.link.findFirst({
      where: {
        url_short: short_url,
      },
    })

    if (!link) {
      throw new NotFoundException('No se encuentra ningun link con ese codigo')
    }

    await this.prisma.link.update({
      where: {
        url_short: link.url_short,
      },
      data: {
        visits: { increment: 1 },
      },
    })

    let ipAddress = req.socket.remoteAddress

    if (!ipAddress) ipAddress = ''
    const countryName = await this.getCountry(ipAddress)

    let country = await this.prisma.country.findUnique({ where: { name: countryName } })

    if (!country) {
      country = await this.prisma.country.create({
        data: {
          name: countryName,
        },
      })
    }

    await this.prisma.linkCountry.upsert({
      create: {
        link: { connect: { id: link.id } },
        country: { connect: { id: country?.id } },
        visits: 1,
      },
      update: {
        visits: { increment: 1 },
      },
      where: { linkId_countryId: { linkId: link.id, countryId: country.id } },
    })

    return link
  }

  async getVisitsUrlshort(id: string): Promise<number> {
    const idNumber = Number(id)

    if (isNaN(idNumber)) throw new BadRequestException('El id debe ser un numero')

    const link = await this.prisma.link.findUnique({ where: { id: idNumber } })
    if (!link) throw new NotFoundException('No se encuentra ningun link con ese id')
    return link.visits
  }

  async getCountriesUrlshort(id: string): Promise<CountryDto[]> {
    const idNumber = Number(id)

    if (isNaN(idNumber)) throw new BadRequestException('El id debe ser un numero')

    const linksCountries = await this.prisma.linkCountry.findMany({
      where: { linkId: idNumber },
      include: { country: true },
    })

    const countries = linksCountries.map(country => {
      return {
        country: country.country.name,
        visits: country.visits,
      }
    })

    return countries
  }

  async getCountry(ip: string): Promise<string> {
    const reponse = await fetch(`https://ipgeolocation.abstractapi.com/v1?api_key=${process.env.API_KEY_IP}&ip_address=${ip}&fields=country`)
    const { country } = await reponse.json()

    return country
  }
}
