import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. สมัครสมาชิก
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // ตรวจสอบว่า Email ซ้ำไหม
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // แฮชรหัสผ่านด้วย bcrypt (รอบหมุน 10 เป็นค่ามาตรฐานความปลอดภัย)
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกลง Database
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // ส่งคืนข้อมูลโดย "ไม่ส่ง password" กลับไปเด็ดขาด
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  // 2. ล็อกอิน
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // หา User ตาม email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ตรวจสอบความถูกต้องของรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // สร้าง JWT Payload (sub = Subject คือมาตรฐานที่ใช้เก็บ User ID)
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
