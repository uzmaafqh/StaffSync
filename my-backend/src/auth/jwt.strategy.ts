import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'uzmacantikkebabom', // Ensure this matches your JwtModule secret
    });
  }

  async validate(payload: any) {
    // This attaches payload data to req.user
    return { userId: payload.sub, email: payload.email };
  }
}