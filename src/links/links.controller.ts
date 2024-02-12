import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { Response, Request } from 'express'
import { LinksService } from './links.service'
import { CreateLinkDto } from './dto/create-link.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { Link } from './entities/link.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AuthRequest } from 'types'

@Controller('links')
@ApiTags('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  async findAllLinks(): Promise<Link[]> {
    return await this.linksService.findAll()
  }

  @Get(':id')
  async findOneLink(@Param('id') id: string): Promise<Link> {
    return await this.linksService.findOne(id)
  }

  @Post()
  @UseGuards(AuthGuard)
  async createUrlShort(@Req() req: AuthRequest, @Body() body: CreateLinkDto, @Query('param') param: string): Promise<Link> {
    return await this.linksService.createUrlShort(req, body, param)
  }

  @Get(':shortUrl')
  async redirect(@Res() res: Response, @Req() req: Request, @Param('shortUrl') shortUrl: string) {
    const link = await this.linksService.redirectToOriginalUrl(shortUrl, req)

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getLinksByUser(@Req() req: AuthRequest, @Param('userId') userId: string): Promise<Link[]> {
    return await this.linksService.getLinksByUser(req, userId)
  }
}
