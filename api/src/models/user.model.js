import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sequelizeInstance } from '../db/index.js';
import { DataTypes, Model } from 'sequelize';

export class User extends Model {
    async isPasswordCorrect(password) {
        return await bcrypt.compare(password, this.password);
    }

    generateAccessToken() {
        return jwt.sign({
            _id: this._id,
            username: this.username
        }, process.env.ACCESS_TOKEN_SCERET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN });
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    sequelize: sequelizeInstance,
    timestamps: true,
    tableName:  "users",
    hooks: {
        beforeSave: async (user) => {
            if(!user.changed('password')) return;
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
});

(async () => {
    await sequelizeInstance.sync();
})();