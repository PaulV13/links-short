import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateLinkDto } from './dto/create-link.dto'
import { Request } from 'express'
import { AuthRequest } from 'types'
import { Link } from './entities/link.entity'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async createUrlShort(req: AuthRequest, body: CreateLinkDto, code: string): Promise<Link> {
    const user = req.user
    const { urlOriginal } = body

    if (!urlOriginal) throw new BadRequestException('The url can not be empty')

    const codeExist = code || ''

    if (codeExist !== '') {
      const linkExist = await this.prisma.link.findFirst({ where: { url_short: codeExist } })
      if (linkExist) throw new BadRequestException('Already exist link with this alias, try with other')
    }

    const urlShort = codeExist !== '' ? codeExist : Math.random().toString(36).substring(2, 8)

    const newLink = await this.prisma.link.create({
      data: {
        url_original: urlOriginal,
        url_short: urlShort,
        visits: 0,
        userId: user.sub,
      },
    })

    return plainToInstance(Link, newLink)
  }

  async createUrlShortNoAuth(body: CreateLinkDto): Promise<Link> {
    const { urlOriginal } = body

    if (!urlOriginal) throw new BadRequestException('The url can not be empty')

    const urlShort = Math.random().toString(36).substring(2, 8)

    const newLink = await this.prisma.link.create({
      data: {
        url_original: urlOriginal,
        url_short: urlShort,
        visits: 0,
        userId: null,
      },
    })

    return plainToInstance(Link, newLink)
  }

  async redirectToOriginalUrl(short_url: string, req: Request): Promise<Link | null> {
    const link = await this.prisma.link.findFirst({
      where: {
        url_short: short_url,
      },
    })

    if (!link) {
      throw new NotFoundException('Can not find a link whit to this alias')
    }

    await this.prisma.link.update({
      where: {
        url_short: link.url_short,
      },
      data: {
        visits: { increment: 1 },
      },
    })

    let countryName = await this.getCountry(req)

    if (!countryName) {
      countryName = 'Unknown'
    }

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

    return plainToInstance(Link, link)
  }

  private async getCountry(req: Request): Promise<string> {
    let ipAddress = (await this.getIp(req)) || '103.37.180.0'
    ipAddress = ipAddress.toString().split(',')[0]

    const reponse = await fetch(`https://ipgeolocation.abstractapi.com/v1?api_key=${process.env.API_KEY_IP}&ip_address=${ipAddress}&fields=country`)
    const { country } = await reponse.json()

    return country
  }

  private async getIp(request: Request): Promise<string | string[]> {
    const ip = request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || request.socket.remoteAddress || ''
    return ip
  }

  async getLinksByUser(req: AuthRequest, userId: string): Promise<Link[]> {
    const idNumber = Number(userId)

    if (req.user.sub !== idNumber) throw new BadRequestException('You are not allowed to view these links')

    if (isNaN(idNumber)) throw new BadRequestException('The id must be a number')

    const links = await this.prisma.link.findMany({
      where: { userId: idNumber },
      include: {
        countries: {
          select: { country: true, visits: true },
        },
      },
    })

    return plainToInstance(Link, links)
  }
}
