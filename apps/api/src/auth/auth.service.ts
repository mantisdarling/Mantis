import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as otplib from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: (dto.role as any) || 'LEARNER',
        timezone: dto.timezone,
        profile: { create: {} },
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { access_token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      access_token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          role: 'LEARNER',
          profile: { create: { avatarUrl: googleUser.picture } },
        },
      });
    }
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      access_token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async generate2FA(userId: string) {
    const secret = otplib.authenticator.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });
    const otpauth = otplib.authenticator.keyuri(userId, 'MANTIS', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    return { qrCodeUrl, secret };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new UnauthorizedException('2FA not set up');

    const valid = otplib.authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!valid) throw new UnauthorizedException('Invalid OTP');

    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });
    return { success: true, message: '2FA enabled successfully' };
  }
}
