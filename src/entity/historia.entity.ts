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

    @Column({ name: "idusuario", type: "int", nullable: true })
    idusuario: number;

}