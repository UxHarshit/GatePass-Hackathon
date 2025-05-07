import { models } from "../model/index.js";

async function authRoutes(fastify, options) {

    fastify.post("/login", async (request, reply) => {
        const { email, password } = request.body;
        if (!email || !password) {
            return reply.status(400).send({ message: "Email and password are required" });
        }
        try {
            const team = await models.Teams.findOne({ where: { leaderemail: email } });
            if (!team) {
                return reply.status(401).send({ message: "Invalid email or password" });
            }

            var lowPassword = password.toLowerCase();

            const teamnamePart = team.teamname.slice(0, 2).toLowerCase();
            const teamLeaderPart = team.leadername.slice(0, 2).toLowerCase();
            const passwordPart = team.leaderphone.slice(-4).toLowerCase();
            const expectedPassword = `${teamnamePart}${teamLeaderPart}${passwordPart}`;
            if (expectedPassword != lowPassword) {
                return reply.status(401).send({ message: "Invalid email or password" });
            }
            return reply.status(200).send({ message: "Login successful", team });
        } catch (error) {
            console.error("Error during login:", error);
            return reply.status(500).send({ message: "Internal server error" });
        }
    });

    fastify.post("/register", async (request, reply) => {
        const { teamname, leadername, leaderemail, leaderphone } = request.body;
        try {
            const team = await models.Teams.create({
                teamname,
                leadername,
                leaderemail,
                leaderphone,
                teammembers : [],
            });
            return reply.status(201).send({ message: "Team registered successfully", team });
        } catch (error) {
            console.error("Error during registration:", error);
            return reply.status(500).send({ message: "Internal server error" });
        }
    } );
}

export default authRoutes;