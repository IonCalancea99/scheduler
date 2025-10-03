import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("reminders")
export class Reminder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 10})
  channel: "mail" | "database";

  @Column({ type: "varchar", length: 256 })
  message: string;

  @Column({ type: "datetime", default: Date.now() })
  time: string; // ISO date string

  @Column({ type: "varchar", length: 50, nullable: true })
  email?: string;

  @Column({ type: "datetime", nullable: true })
  sent_at?: string; // ISO date string

  @Column({ type: "datetime", nullable: true })
  failed_at?: string; // ISO date string
}
