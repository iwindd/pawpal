import { Controller, Get, NotFoundException } from '@nestjs/common';
import { GetPublishedHomeLayoutUseCase } from '../application/usecases/get-published-home-layout.usecase';

@Controller('home-layout')
export class HomeLayoutController {
  constructor(
    private readonly getPublishedHomeLayoutUseCase: GetPublishedHomeLayoutUseCase,
  ) {}

  @Get()
  async getPublished() {
    const homeLayout = await this.getPublishedHomeLayoutUseCase.execute();

    if (!homeLayout) {
      throw new NotFoundException('Published home layout not found');
    }

    return {
      version: homeLayout.version,
      sections: homeLayout.sections,
      updatedAt: homeLayout.updatedAt,
    };
  }
}
