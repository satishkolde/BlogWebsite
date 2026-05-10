import { Model, DataTypes } from "sequelize";
import { sequelizeInstance } from "../db/index.js";

export class Comment extends Model {}

Comment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    author: {
        type: DataTypes.STRING,
        references: {
            model: "users",
            key: "username"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
    },
    blog: {
        type: DataTypes.UUID,
        references: {
            model: "blogs",
            key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeInstance,
    tableName: "comments"
});

(async () => {
    await sequelizeInstance.sync();
})();