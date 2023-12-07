import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/entity/usuario.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) { }

    async registrarUsuarioSinFoto(data: any): Promise<Usuario> {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const usuario = new Usuario();
        usuario.nombre = data.nombre;
        usuario.correo = data.correo;
        usuario.contrasena = hashedPassword;
        usuario.saldo = 10;

        // Guarda el usuario en la base de datos
        return await this.usuarioRepository.save(usuario);
    }

    async login(correo: string, contrasena: string): Promise<Usuario> {

        const usuario = await this.usuarioRepository.findOne({ where: { correo: correo } });
        if (usuario && (await bcrypt.compare(contrasena, usuario.contrasena))) {
            console.log('devolviendo login desde el backend', usuario);
            return usuario;
        }
        return null;
    }
}
