import { DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { supportTicketReply } from './support_ticket_replies.model';

export interface supportTicketAttributes {
    query_id: number;
    query_category: string;
    query_details: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

export class supportTicket extends Model<supportTicketAttributes> { }

supportTicket.init(
    {
        query_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        query_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        query_details: {
            type: DataTypes.TEXT("long"),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.support_tickets_status_flags.list)),
            defaultValue: constents.support_tickets_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            onUpdate: new Date().toLocaleString()
        }
    },
    {
        sequelize: db,
        tableName: 'supportTickets',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

supportTicket.belongsTo(supportTicketReply, { foreignKey: 'query_id' });
supportTicketReply.hasMany(supportTicket, { foreignKey: 'query_id' });