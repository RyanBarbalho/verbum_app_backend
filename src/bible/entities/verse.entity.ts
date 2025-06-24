import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('verses')
export class Verse {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int'})
    number: number;

    @Column({ type: 'text' })
    text: string;

    @ManyToOne(
        () => Chapter,
        chapter => chapter.verses,
        { onDelete: 'CASCADE'}
    )
    chapter: Chapter;

    @Column()
    chapterId: string;
}