import { Controller, Post, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus, Patch, Put, Param, Get } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }
  @Post('register')
  @UseInterceptors(FileInterceptor('foto'))
  async registrarUsuario(@Body() body: any,): Promise<any> {
    try {
      const usuario = await this.usuarioService.registrarUsuarioSinFoto(body);
      const token = jwt.sign({ userId: usuario.id, correo: usuario.correo }, 'tu_secreto_secreto', {
        expiresIn: '2h', // El token expira en 1 hora (puedes ajustar este valor según tus necesidades)
      });
      return { message: 'Inicio de sesión exitoso', usuario, token };
    } catch (error) {
      throw new HttpException(`Error al Registrarse: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Post('login')
  async login(@Body() body: { correo: string; contrasena: string }) {
    try {
      const user = await this.usuarioService.login(body.correo, body.contrasena);
      if (!user) {
        throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);
      }
      const token = jwt.sign({ userId: user.id, correo: user.correo }, 'tu_secreto_secreto', {
        expiresIn: '2h', // El token expira en 1 hora (puedes ajustar este valor según tus necesidades)
      });
      return { message: 'Inicio de sesión exitoso', user, token };
    } catch (error) {
      throw new HttpException('Error al iniciar sesión: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
