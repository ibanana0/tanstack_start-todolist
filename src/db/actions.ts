import { createTodoCollection, Todo } from './todoCollection';
import { RxCollection } from 'rxdb';

let collectionPromise: Promise<RxCollection<Todo> | null> | null = null;

async function getCollection(): Promise<RxCollection<Todo> | null> {
    // Karena RxDB berjalan di browser, pastikan program jalan di browser
    if (typeof window === "undefined") {
        return null;
    }

    // Memeriksa apakah ada promise apa belum, jika belum, maka perlu dibuat
    if (!collectionPromise) {
        collectionPromise = createTodoCollection();
    }
    return collectionPromise;
}

export const TodoActions = {
    async getAll(): Promise<Todo[]> {
        try {
            // mendapatkan collection (item todo)
            const collection = await getCollection();
            // memeriksa apakah ada item todo atau tidak, jika tidak ada maka return kosong
            if (!collection) {
                return [];
            }

            const docs = await collection.find().exec();
            return docs.map((doc) => ({
                id: doc.id,
                title: doc.title,
                completed: doc.completed,
            }));
        } catch (error) {
            console.error("TodoActions.getAll error:", error);
            throw error;
        }
    },
    async add(title: string) {
        const collection = await getCollection();
        // memeriksa apakah collection sudah diinisialisasikan atau belum
        if (!collection) {
            throw new Error("TodoActions.add error: Collection not initialized");
        }

        await collection.insert({
            id: crypto.randomUUID(),
            title: title,
            completed: false,
        });
    },
    async update(
        id: string,
        changes: Partial<{ title: string; completed: boolean }>
    ) {
        const collection = await getCollection();
        if (!collection) {
            throw new Error("TodoActions.update error: Collection not initialized");
        }

        // mencari doc di dalam collection
        const doc = await collection.findOne(id).exec();
        if (doc) {
            const patch: any = {};
            if (typeof changes.title !== "undefined") {
                patch.title = changes.title;
            }
            if (typeof changes.completed !== "undefined") {
                patch.completed = changes.completed;
            }

            // memeriksa apakah ada update atau tidak
            if (Object.keys(patch).length > 0) {
                await doc.patch(patch);
            }
        }
    },
    async toggle(id: string) {
        const collection = await getCollection();
        if (!collection) {
            throw new Error("TodoActions.toggle error: Collection not initialized");
        }

        const doc = await collection.findOne(id).exec();
        if (doc) {
            return doc.patch({ completed: !doc.completed });
        }
    },
    async remove(id: string) {
        const collection = await getCollection();
        if (!collection) {
            throw new Error("TodoActions.remove error: Collection not initialized");
        }

        const doc = await collection.findOne(id).exec();
        if (doc) {
            await doc.remove();
        }
    },
}