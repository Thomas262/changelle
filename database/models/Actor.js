module.exports = (sequelize, DataTypes) => {
    let alias = 'Actors';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.DECIMAL
        },
        favorite_movie_id: {
            type: DataTypes.INTEGER
        },
        created_at: {
            type: DataTypes.DATE // Corregir el tipo de datos
        },
        updated_at: {
            type: DataTypes.DATE // También puedes usar DataTypes.DATE para updated_at si es necesario
        }
    };
    
    let config = {
        tableName: 'actors',
        timestamps: false 
    };
    const Actor = sequelize.define(alias, cols, config)

    return Actor
};
