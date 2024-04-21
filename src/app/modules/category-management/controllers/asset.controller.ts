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
    console.log("createDto", createDto);

    return this.assetService.create(createDto);
  }

  @Patch("assets/:id")
  async updateAsset(@Body() updateDto: any, @Param("id") id: number) {
    console.log("id", id);
    console.log("updateDto", updateDto);

    return this.assetService.update(+id, updateDto);
  }

  @Delete("assets/:id")
  async removeAsset(@Param("id") id: number) {
    console.log("id", id);

    return this.assetService.remove(+id);
  }
}
