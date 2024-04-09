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
        timestamps: true, // Habilita el seguimiento de fechas de creación y actualización
        createdAt: 'created_at', // Define el nombre del campo de fecha de creación
        updatedAt: 'updated_at' // Define el nombre del campo de fecha de actualización
    };
    const User = sequelize.define(alias, cols, config);

    return User;
};
