/* 
TECH STACK
RxDB - untuk menyimpan data di browser
Dexie - storage yang digunakan 
*/

import { createRxDatabase, removeRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

let dbInstance: any = null;

export async function initDB() {
    // Hanya dapat diinisialisasi jika berada di browser
    if (typeof window === "undefined") {
        console.log("initDB: Not in browser, Skipping");
        return null;
    }

    // Memeriksa apakah ada database instance yang sudah dibuat atau belum
    // Jika ada maka akan me-return dbInstance tersebut
    if (dbInstance) {
        console.log("initDB: Returning to existing instance");
        return dbInstance;
    }

    // Membuat instance database baru
    try {
        console.log("initDB: Creating database instance");
        // create storage
        const storage = getRxStorageDexie();

        // 
        /*
        HAPUS ATAU COMMENT KETIKA SUDAH DIBUILD
        Membantu ketika proses developent:
        - memeriksa apakah ada existing instance database yang di development env
        */
        if (import.meta.env.DEV) {
            try {
                console.log("initDB: Removing existing database instance (devmode)");
                await removeRxDatabase("appdb", storage);
            } catch (e) {
                console.log("initDB: No exsisting database to remove");
            }
        }

        // membuat database
        dbInstance = createRxDatabase({
            name: "appdb",
            storage: storage, 
            multiInstance: false,
            eventReduce: true,
        });
        console.log("initDB: Database created successfully");
        return dbInstance;
    } catch (error) {
        console.log("initDB: Failed to create database", error);
        throw error;
    }
}

/* 
Membersihakn HMR - adalah fitur bawaan modern web development tools (ex. vite)
yang digunakan untuk dapat melihat perubahan kode TANPA refresh page
*/
if (typeof window === "undefined" && import.meta.hot) {
    import.meta.hot.dispose(async () => {
        console.log("HMR: Disposing database");
        if (dbInstance) {
            await dbInstance.destroy();
            dbInstance = null;
        }
    })
}