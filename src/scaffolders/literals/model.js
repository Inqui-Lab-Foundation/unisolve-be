const string_ = require('../helpers/string');

function literal(resource) {
const resourceSingular = string_.singularizer(resource);
const resourceNormalizedSnakeCase = string_.normalizer_snakecase(resource);
const resourceDenormalized = string_.denormalizer(resource);

  return `
import {  DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { ${resourceSingular}Attributes } from '../interfaces/model.interface';

export class ${resourceSingular} extends Model<${resourceSingular}Attributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The "models/index" file will call this method automatically.
     */
    static associate(models: any) {
        // console.log("came here");
        // define association here
        // course.hasMany(models, { foreignKey: "course_id", as: "courseModules" });
    }

    
}
${resourceSingular}.init(
    {
      ${resourceSingular}_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE')
        }
    },
    {
        sequelize: db,
        tableName: '${resourceNormalizedSnakeCase}'
    }
);

//TODO:call associate method is any association is defined
  
`;
}

module.exports = literal