import { sequelizeInstance } from "../db/index.js";
import { Model, DataTypes, DATEONLY } from "sequelize";
import { User } from "./user.model.js";

export class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 100
        }
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'username'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    sequelize: sequelizeInstance,
    timestamps: true,
    tableName: "blogs"
});

(async () => {
    await sequelizeInstance.sync();
})();