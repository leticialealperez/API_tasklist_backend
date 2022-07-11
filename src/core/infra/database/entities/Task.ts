import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ITask } from '../../../../features/tasklist/domain/models/task';
import { User } from './User';

@Entity({
  name: 'task',
  schema: 'public',
})
export class Task implements ITask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  description: string;

  @Column()
  detail: string;

  @ManyToOne(() => User, (user) => user.taskList)
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
