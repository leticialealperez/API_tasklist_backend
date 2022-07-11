import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ITask } from '../../../../features/tasklist/domain/models/task';
import { IUser } from '../../../../features/user/domain/models/user';
import { Task } from './Task';

@Entity({
  name: 'user',
  schema: 'public',
})
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 60 })
  pass: string;

  @OneToMany(() => Task, (task) => task.user_id)
  taskList: ITask[];
}
