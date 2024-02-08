import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import { Response, Request } from 'express'
import { LinksService } from './links.service'
import { Link } from '@prisma/client'
import { LinkDto } from './dto/url.dto'

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  async findAllLinks(): Promise<Link[]> {
    return await this.linksService.findAll()
  }

  @Post()
  async createUrlShort(@Body() body: LinkDto, @Query('param') param: string): Promise<Link> {
    return await this.linksService.createUrlShort(body, param)
  }

  @Get(':shortUrl')
  async redirect(@Res() res: Response, @Req() req: Request, @Param('shortUrl') shortUrl: string) {
    const link = await this.linksService.redirectToOriginalUrl(shortUrl)

    if (link) {
      return res.redirect(link.url_original)
    }
  }

  @Get(':id/visits')
  async getVisitsUrlshort(@Param('id') id: string): Promise<number> {
    return await this.linksService.getVisitsUrlshort(id)
  }

  @Get(':id/countries')
  async getCountriesUrlshort(@Param('id') id: string) {
    return await this.linksService.getCountriesUrlshort(id)
  }
}
