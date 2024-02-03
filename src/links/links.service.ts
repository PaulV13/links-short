import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Link } from '@prisma/client'
import { UrlDto } from './dto/url.dto'
import axios from 'axios'

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

    if (urlOriginal === '' || urlOriginal === undefined) throw new BadRequestException('La url no puede ser vacia')

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

  async updateVisits(link: Link, ipAddress: string | string[]) {
    await this.prisma.link.update({
      where: {
        url_short: link.url_short,
      },
      data: {
        visits: link.visits + 1,
      },
    })

    const newCountry: string = await this.getCountry(ipAddress)

    await this.prisma.country.create({
      data: {
        name: newCountry,
        LinkCountry: {
          create: [
            {
              link: {
                connect: {
                  id: link.id,
                },
              },
            },
          ],
        },
      },
    })
  }

  async getCountry(ipAddress: string | string[]) {
    return axios
      .get(`https://ipgeolocation.abstractapi.com/v1/?api_key=835c354aa85d4b6195173c62ccbe8eaf&ip_address=167.62.229.126`)
      .then(response => {
        return response.data.country
      })
      .catch(error => {
        return error
      })
  }
}
