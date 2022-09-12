import { DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { support_ticket } from './support_ticket.model';

export interface supportTicketRepliesAttributes {
    reply_id: number;
    query_id: string;
    reply_details: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

export class support_ticket_reply extends Model<supportTicketRepliesAttributes> { }

support_ticket_reply.init(
    {
        reply_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        query_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reply_details: {
            type: DataTypes.TEXT("long"),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
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
        tableName: 'support_tickets_replies',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

support_ticket_reply.belongsTo(support_ticket, { foreignKey: 'query_id' });
support_ticket.hasMany(support_ticket_reply, { foreignKey: 'query_id' });