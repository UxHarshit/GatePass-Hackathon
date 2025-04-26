import Teams from "../model/Teams.js";
import sequelize from "../config/db.js";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ask = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

async function insertData() {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synced successfully.");
        const leadername = await ask("Enter leader name: ");
        const leaderemail = leadername.split(" ").join("").toLowerCase() + "@gmail.com";
        const leaderphone = await ask("Enter leader phone: ");
        const teamname = "Team " + leadername;
        const deskno = "Desk no 1";

        const teammembers = [];

        teammembers.push({ name: leadername, ispresent: true });

        const numMembers = 0;

        for (let i = 0; i < numMembers; i++) {
            const memberName = await ask(`Enter name of team member ${i + 1}: `);
            const isPresent = await ask(`Is ${memberName} present? (y/n): `);
            teammembers.push({ name: memberName, ispresent: isPresent === 'y' });
        }

        await Teams.create({
            leadername,
            leaderemail,
            leaderphone,
            teamname,
            deskno,
            teammembers
        });

        console.log("New team created successfully");

        console.log("User email:", leaderemail);
        console.log("User Pass",teamname.trim().slice(0, 4).toLowerCase() + leadername.slice(0, 4).toLowerCase() + leaderphone.slice(-4).toLowerCase());

    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        rl.close();
    }
}

insertData();