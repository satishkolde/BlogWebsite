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
        refrences: {
            model: "users",
            key: "username"
        },
        allowNull: false
    },
    blog: {
        type: DataTypes.UUID,
        refrences: {
            model: "blogs",
            key: "id"
        },
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