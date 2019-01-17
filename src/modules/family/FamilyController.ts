import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req } from '@tsed/common';
import { Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../auth/AuthMiddleware';
import { Family } from './Family';
import { FamilyService } from './FamilyService';
import { FamilyCreateUpdate } from './models/FamilyCreateUpdate';


@Controller('/family')
export class FamilyController {

  constructor(
    private familyService: FamilyService
  ) {}

  @Post('/')
  @Summary('Create family')
  @Authenticated()
  @Security('token')
  public async create(
    @BodyParams() family: FamilyCreateUpdate,
    @Req() req: UserRequest
  ) {
    return {
      err: false,
      data: await this.familyService.create(family, req.user)
    };
  }

  @Post('/:familyId/join')
  @Summary('Join family')
  @Authenticated()
  @Security('token')
  public async joinFamily(
    @PathParams('familyId') familyId: string,
    @Req() req: UserRequest
  ) {
    return {
      err: false,
      data: await this.familyService.join(familyId, req.user)
    };
  }

  @Get('/')
  @Summary('Receives active family')
  @Authenticated()
  @Security('token')
  public async getActiveFamily(
    @Req() req: UserRequest
  ) {
    return {
      err: false,
      data: await this.familyService.mapActiveFamilyForUser(req.user)
    };
  }

  @Get('/qrcode')
  @Summary('Get QR Code for active family')
  @Authenticated()
  @Security('token')
  public async getQrcode(
    @Req() req: UserRequest
  ) {
    return {
      err: false,
      data: await this.familyService.generateQrcode(req.user)
    };
  }

  @Get('/:familyId')
  @Summary('Get family')
  @Authenticated()
  @Security('token')
  public async getFamily(
    @PathParams('familyId') familyId: string
  ) {
    return {
      err: false,
      data: await this.familyService.get(familyId)
    };
  }

  @Put('/')
  @Summary('Update active family')
  @Authenticated()
  @Security('token')
  public async update(
    @BodyParams() family: FamilyCreateUpdate,
    @Req() req: UserRequest
  ) {
    return {
      err: false,
      data: await this.familyService.update(family, req.user)
    };
  }

  @Delete('/')
  @Summary('Leaves active family')
  @Authenticated()
  @Security('token')
  public async leaveActiveFamily(
    @Req() req: UserRequest
  ) {
    return {
      err: false,
      data: await this.familyService.leave(req.user)
    };
  }

}
