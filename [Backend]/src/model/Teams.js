import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";


class Teams extends Model { }

Teams.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        leadername: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        leaderemail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        leaderphone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        teamname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isadmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        teammembers: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        deskno:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ispermitted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "Teams",
    }
);

export default Teams;