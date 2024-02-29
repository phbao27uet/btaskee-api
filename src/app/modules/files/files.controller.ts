import { Controller, Put } from '@nestjs/common';

@Controller('files')
export class FilesController {
  @Put('local')

  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const randomName = cuid();
  //         const fileExtension = file.originalname.split('.').pop();
  //         const newFileName = `${randomName}.${fileExtension}`;
  //         cb(null, newFileName);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 1024 * 1024 * 200,
  //     },
  //     fileFilter: (req, file, cb) => {
  //       if (
  //         !file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3)$/)
  //       ) {
  //         return cb(new BadRequestException('Invalid file format'), false);
  //       }
  //       cb(null, true);
  //     },
  //   }),
  // )
  // local(@UploadedFile() file: Express.Multer.File) {
  //   return {
  //     statusCode: 200,
  //     data: `${API_URL}/${file?.path}`,
  //   };
  // }
  local() {
    return {
      statusCode: 200,
      data: 'local',
    };
  }
}
