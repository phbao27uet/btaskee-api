import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CreateLicenseQuantityDto } from './dto/create-license-quantity.dto';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { LicensesService } from './licenses.service';

@Controller('admin/licenses')
@ApiTags('admin licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @ApiBody({
    type: CreateLicenseDto,
    schema: {
      $ref: getSchemaPath(CreateLicenseDto),
    },
  })
  @Post()
  create(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licensesService.create(createLicenseDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @ApiBody({
    type: CreateLicenseQuantityDto,
    schema: {
      $ref: getSchemaPath(CreateLicenseQuantityDto),
    },
  })
  @Post('/quantity')
  createWithQuantity(
    @Body() createLicenseQuantityDto: CreateLicenseQuantityDto,
  ) {
    return this.licensesService.createWithQuantity(createLicenseQuantityDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get()
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 20) {
    return this.licensesService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.licensesService.findOne(code);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Put(':code')
  update(
    @Param('code') code: string,
    @Body() updateLicenseDto: UpdateLicenseDto,
  ) {
    return this.licensesService.update(code, updateLicenseDto);
  }
}
