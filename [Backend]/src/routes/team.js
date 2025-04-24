import { models } from "../model/index.js";
import * as OTPAuth from "otpauth";

async function teamRoutes(fastify, options) {
    fastify.post('/team', async (request, reply) => {
        try {
            const { mail } = request.body;
            console.log(request.body);
            const team = await models.Teams.findOne({ where: { leaderemail: mail } });
            if (!team) {
                return reply.status(404).send({ error: 'Team not found' });
            }

            return reply.status(200).send({
                status: 'success',
                message: 'Team found',
                team
            });
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    })

    fastify.post('/detailteam', async (request, reply) => {
        try {
            const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";

            const { teamId, otp } = request.body;
            if (!teamId || !otp) {
                return reply.status(400).send({ error: 'teamId and otp are required' });
            }
            const team = await models.Teams.findOne({ where: { id: teamId } });
            if (!team) {
                return reply.status(404).send({ error: 'Team not found' });
            }
            const generateTOTP = (timestamp = Date.now()) => {
                const totp = new OTPAuth.TOTP({
                    secret: OTPAuth.Secret.fromBase32(secret),
                    algorithm: "SHA1",
                    digits: 6,
                    period: 30,
                });
                return totp.generate({ time: timestamp });
            }
            const generatedOTP = generateTOTP(Date.now());
            if (generatedOTP !== otp) {
                return reply.status(400).send({ error: 'Invalid OTP' });
            }
            const teamMembers = await models.Teams.findByPk(teamId);
            if (!teamMembers) {
                return reply.status(404).send({ error: 'Team members not found' });
            }

            return reply.status(200).send({
                status: 'success',
                message: 'Team members found',
                teamdata: teamMembers,
            });

        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    })

    fastify.put("/present", async (request, reply) => {

        try {
            const { teamId, teammembers } = request.body;
            if (!teamId || !teammembers) {
                return reply.status(400).send({ error: 'teamId and teammembers are required' });
            }
            const team = await models.Teams.findOne({ where: { id: teamId } });
            if (!team) {
                return reply.status(404).send({ error: 'Team not found' });
            }
            team.teammembers = teammembers;
            await team.save();
            return reply.status(200).send({
                status: 'success',
                message: 'Team members updated successfully',
                teamdata: team,
            });
        } catch (err) {
            console.error(err);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    })

};


export default teamRoutes;