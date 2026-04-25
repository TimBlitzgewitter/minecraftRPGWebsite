import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_users')
export class WebUser {
  @PrimaryGeneratedColumn()
  id: number;

  // Discord Daten (Optional, falls nur per E-Mail registriert)
  @Column({ unique: true, nullable: true })
  discordId: string;

  @Column({ nullable: true })
  discordName: string;

  @Column({ nullable: true })
  avatar: string;

  // E-Mail & Passwort Daten (Optional, falls nur per Discord registriert)
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  discord_email: string;

  @Column({ nullable: true, select: false }) // select: false sorgt dafür, dass das PW nicht versehentlich in API-Antworten landet
  password: string;

  @Column({ default: 'GUEST' })
  role: string;

  @Column({ nullable: true })
  minecraft_uuid: string;

  @Column({ default: false })
  isMerged: boolean; // Wird true, sobald der User sich entschieden hat
}