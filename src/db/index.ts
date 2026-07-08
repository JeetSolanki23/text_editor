import Dexie, { type EntityTable } from 'dexie';

interface Document {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const db = new Dexie('EditorDB') as Dexie & {
  documents: EntityTable<
    Document,
    'id'
  >;
};

db.version(1).stores({
  documents: 'id, title, updatedAt'
});

export type { Document };
export { db };
