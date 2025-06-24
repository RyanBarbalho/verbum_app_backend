import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';
import { Verse } from './verse.entity';

@Entity('chapters')
export class Chapter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int'})
    number: number;

    @ManyToOne(() => Book, book => book.chapters, { onDelete: 'CASCADE'})
    book: Book;

    @Column()
    bookId: string;

    @OneToMany(() => Verse, verse => verse.chapter, {cascade: true })
    verses: Verse[];

}