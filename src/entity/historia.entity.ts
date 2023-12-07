import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Video } from './video.entity';

@Entity('historia')
export class Historia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "titulo", type: "varchar", nullable: true })
    titulo: string;

    @Column({ name: "url", type: "varchar", nullable: true })
    url: string;

    @ManyToOne(() => Usuario, usuario => usuario.historias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idusuario' }) // Especifica el nombre de la columna en la tabla 'evento'
    usuario: Usuario;

    @OneToMany(() => Video, video => video.historia)
    videos: Video[];
}