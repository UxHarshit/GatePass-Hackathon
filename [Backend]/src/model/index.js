import sequelize from "../config/db.js";
import Teams  from "./Teams.js";

const models = {
    Teams,
};

const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Models synced successfully. ✅");
    } catch (error) {
        console.error("❌ Error syncing models:", error);
    }
}

export {
    sequelize,
    models,
    syncModels

};
