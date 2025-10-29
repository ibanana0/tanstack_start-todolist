import { initDB } from './client';
import { RxCollection } from 'rxdb';

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

let todoCollectionInstance: RxCollection<Todo> | null = null;

export async function createTodoCollection() {
    // Hanya dapat dibuat jika berada di browser
    // Mencegah server-side execution
    if (typeof window === "undefined") {
        console.log("createTodoCollection: Not in browser, skipping");
        return null;
    }

    // Memeriksa apakah ada database instance atau belum
    if (todoCollectionInstance) {
        console.log("createTodoCollection: Returning existing instance");
        return todoCollectionInstance;
    }

    // Menginisialisasi database dengan fungsi initDB()
    try {
        console.log("createTodoCollection: Initializing database");
        const db = await initDB();

        // Memeriksa apakah ketika menginisialisasi ada error
        if (!db) {
            console.error(
                "createTodoCollection: Error while initializing database",
            );
            return null;
        }

        console.log("createTodoCollection: Adding collections");
        if (!db.todos) {
            await db.addCollections({
                todos: {
                    schema: {
                        version: 0,
                        primaryKey: "id",
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                maxLength: 100,
                            },
                            title: {
                                type: "string",
                            },
                            completed: {
                                type: "boolean",
                            },
                        },
                        required: ["id", "title", "completed"],
                    },
                },
            });
            console.log("createTodoCollection: Collections added successfully!");
        }

        // return RxDB Collections
        todoCollectionInstance = db.todos;
        console.log("createTodoCollection: Collection created successfully!");
        return todoCollectionInstance;
    } catch (error) {
        console.error("createTodoCollection: Failed to create collection", error);
        throw error;
    }
}