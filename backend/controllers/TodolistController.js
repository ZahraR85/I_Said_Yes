import Guest from '../models/guest.js';
import Makeup from '../models/makeup.js';
import Catering from '../models/cateringSelection.js';
import Music from '../models/music.js';
import Photography from '../models/photography.js';
import Userinfo from '../models/userinfo.js';
import Venue from '../models/venueSelection.js';

const models = [
    { model: Guest, name: "Guest" },
    { model: Makeup, name: "Makeup" },
    { model: Catering, name: "Catering" },
    { model: Music, name: "Music" },
    { model: Photography, name: "Photography" },
    { model: Userinfo, name: "Detail Information" },
    { model: Venue, name: "Venue" },
];

export async function getUserProgress(userID) {
    if (!userID) throw new Error("User ID is not provided.");
    
    const progressData = {};
    let completedCount = 0;

    for (const { model, name } of models) {
        try {
            let exists;
            if (name === "Venue" || name === "Catering") {
                // Query using 'userId' for Venue and Catering models
                exists = await model.exists({ userId: userID });
            } else {
                // Query using 'userID' for other models
                exists = await model.exists({ userID });
            }

            if (exists) {
                progressData[name] = true; // Mark as completed
                completedCount++;
            } else {
                progressData[name] = false; // Mark as not completed
            }
           
        } catch (error) {
            console.error(`Error querying model ${name}:`, error.message);
            progressData[name] = false; // Mark as not completed if there's an error
        }
    }

    const percentageDone = Math.round((completedCount / models.length) * 100);

    return {
        completedCount,
        totalModels: models.length,
        percentageDone,
        progressData,
    };
}
