import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AssetService } from "../services/asset.service";

@Controller("category-management")
export class AssetController {
  constructor(private assetService: AssetService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("assets")
  async findAllAssets(@Query("page") page = 1, @Query("perPage") perPage = 20) {
    return this.assetService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get("assets/:id")
  async findOneAsset(@Param("id") id: number) {
    return this.assetService.findOne(+id);
  }

  @Post("assets")
  async createAsset(@Body() createDto: any) {
    return this.assetService.create(createDto);
  }

  @Post("assets/recall/:id")
  async recallAsset(@Param("id") id: number) {
    console.log(id);

    return this.assetService.recall(+id);
  }

  @Post("assets/assign/:id")
  async assignAsset(@Param("id") id: number, @Body() assignDto: any) {
    console.log(assignDto);

    return this.assetService.assign(+id, assignDto.department_id);
  }

  @Patch("assets/:id")
  async updateAsset(@Body() updateDto: any, @Param("id") id: number) {
    return this.assetService.update(+id, updateDto);
  }

  @Delete("assets/:id")
  async removeAsset(@Param("id") id: number) {
    return this.assetService.remove(+id);
  }
}
