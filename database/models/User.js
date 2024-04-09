module.exports = (sequelize, DataTypes) => {
    let alias = 'User';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        remember_token: {
            type: DataTypes.STRING
        },
        rol: {
            type: DataTypes.TINYINT
        }
    };
    let config = {
        tableName: 'users',
        timestamps: true, 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    };
    const User = sequelize.define(alias, cols, config);

    return User;
};
