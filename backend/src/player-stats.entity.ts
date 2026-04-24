import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('player_stats') // Verknüpft diese Klasse mit deiner bestehenden MySQL-Tabelle
export class PlayerStats {
  
  // PrimaryColumn sagt TypeORM, dass das der PRIMARY KEY ist.
  @PrimaryColumn({ type: 'varchar', length: 36 })
  uuid!: string;

  @Column({ type: 'int', default: 1 })
  level!: number;

  @Column({ type: 'double', default: 0 })
  exp!: number;

  @Column({ type: 'varchar', length: 32, default: 'NONE' })
  class!: string;

  @Column({ type: 'varchar', length: 32, default: 'NONE' })
  secondary_class!: string;

  @Column({ type: 'int', default: 0 })
  class_points!: number;

  @Column({ type: 'int', default: 0 })
  reputation!: number;

  @Column({ type: 'int', default: 0 })
  merits!: number;

  @Column({ type: 'int', default: 0 })
  attribute_points!: number;

  @Column({ type: 'int', default: 0 })
  skill_points!: number;

  @Column({ type: 'int', default: 0 })
  sanctum_id!: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  active_title!: string | null;
}