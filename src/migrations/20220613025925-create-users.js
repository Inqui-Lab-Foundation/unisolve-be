'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(55),
        
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      mobile: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      team_id: {
        allowNull:true,
        type: Sequelize.INTEGER
      },
      org_name: {
        type: Sequelize.STRING
      },
      qualification: {
        type: Sequelize.STRING
      },
      stream: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'STUDENT', 'MENTOR','EVALUATOR'),
        defaultValue: 'ADMIN'
      },
      is_loggedin: {
        type: Sequelize.ENUM('YES', 'NO'),
        defaultValue: 'NO'
      },
      last_login: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'DELETED'),
        defaultValue: 'ACTIVE'
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};