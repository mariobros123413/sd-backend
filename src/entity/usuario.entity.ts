import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Historia } from './historia.entity';

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "nombre", type: "varchar", nullable: true })
    nombre: string;

    @Column({ name: "correo", type: "varchar", nullable: true })
    correo: string;

    @Column({ name: "contrasena", type: "varchar", nullable: true })
    contrasena: string;

    @Column({ name: "saldo", type: "int", nullable: true })
    saldo: number;

}