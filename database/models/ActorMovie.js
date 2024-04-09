module.exports = (sequelize, DataTypes) => {
    const ActorMovie = sequelize.define('ActorMovie', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        actor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'actor_movie',
        timestamps: false
    });

    return ActorMovie;
};
