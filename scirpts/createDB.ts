import { initializeDatabase } from "@/app/db/index";
import { exit } from "process";

function createDB() {
  initializeDatabase()
    .then(() => {
      console.log("Database initialized successfully.");
    })
    .catch(error => {
      console.error("Error initializing database:", error);
    });
}

createDB();

exit(0); // Exit the process after running the script
