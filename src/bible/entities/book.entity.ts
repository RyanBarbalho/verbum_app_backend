import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    abbreviation: string;

    @Column()
    testament: 'old' | 'new';

    @Column()
    order: number;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Chapter, chapter => chapter.book, { cascade: true })
    chapters: Chapter[]
}
