import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Session } from '@pawpal/shared';

@Injectable()
export class SignTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(user: Session): string {
    return this.jwtService.sign({ sub: user.id });
  }
}
