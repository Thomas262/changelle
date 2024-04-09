module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        rating: DataTypes.INTEGER,
        length: DataTypes.INTEGER,
        awards: DataTypes.INTEGER,
        release_date: DataTypes.DATE,
        genre_id: DataTypes.INTEGER 
    }, {
        tableName: 'movies',
        timestamps: false
    });

    Movie.associate = (models) => {
        Movie.belongsTo(models.Genre, { foreignKey: 'genre_Id' }); 
    };
    

    return Movie;
};
