import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Link } from '@prisma/client'
import { UrlDto } from './dto/url.dto'

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Link[]> {
    const links = await this.prisma.link.findMany()
    if (links.length === 0) throw new NotFoundException('No se encuentra ningun link')
    return links
  }

  async createUrlShort(body: UrlDto, param: string): Promise<Link> {
    const { urlOriginal } = body
    console.log(urlOriginal)
    if (urlOriginal === '') throw new BadRequestException('La url no puede ser vacia')

    //Busca que exista el link con la url original y si existe la retorna
    const link = await this.prisma.link.findUnique({
      where: {
        url_original: urlOriginal,
      },
    })

    if (link) {
      return link
    }

    let urlShort = ''
    if (param) {
      urlShort = param
    } else {
      urlShort = Math.random().toString(36).substring(2, 8)
    }

    //Crea un nuevo link con la url original, la url corta y la visita por defecto en 0
    const newLink = await this.prisma.link.create({
      data: {
        url_original: urlOriginal,
        url_short: urlShort,
        visits: 0,
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

  async updateVisits(urlShort: string) {
    const link = await this.prisma.link.findFirst({
      where: {
        url_short: urlShort,
      },
    })

    if (link) {
      await this.prisma.link.update({
        where: {
          url_short: urlShort,
        },
        data: {
          visits: link.visits + 1,
        },
      })
    }
  }
}
