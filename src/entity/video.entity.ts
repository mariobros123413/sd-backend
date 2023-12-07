import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Historia } from './historia.entity';

@Entity('video')
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "narracion", type: "varchar", nullable: true })
    narracion: string;

    @Column({ name: "descripcion", type: "varchar", nullable: true })
    descripcion: string;

    @Column({ name: "narrador", type: "varchar", nullable: true })
    narrador: string;

    @Column({ name: "url", type: "varchar", nullable: true })
    url: string;

    @ManyToOne(() => Historia, historia => historia.videos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idhistoria' }) // Especifica el nombre de la columna en la tabla 'evento'
    historia: Historia;
    
}