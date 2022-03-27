import type { Table } from 'dexie';
import Dexie from 'dexie';

export interface Exercise {
    id: string;
    activity_name: string;
    sets: number;
    reps: Array<number>;
    weight: number;
    notes: string;
}

export interface Session {
    id: string;
    timestamp: string;
    exercises: Array<Exercise>;
    session_notes: string;
}

export class MySubClassedDexie extends Dexie {
    sessions!: Table<Session>;

	constructor() {
		super('myDatabase');
		this.version(2).stores({
            sessions: 'id',
		});
	}
}

export const db = new MySubClassedDexie();
