import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UserEntity } from '../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(name: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async createOne({ name, password }: UserEntity): Promise<UserEntity> {
    const id = randomUUID();

    const newUser = this.userRepository.create({ id, name, password });

    return await this.userRepository.save(newUser);
  }
}
