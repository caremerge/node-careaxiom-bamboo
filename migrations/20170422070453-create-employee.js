'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('employees', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			employeeId: {
				type: Sequelize.INTEGER
			},
			data: {
				type: Sequelize.JSONB
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		}).then(() => {
			return queryInterface.addIndex('employees', ['employeeId'], {
				name: 'idxEmployeeId',
				type: 'unique'
			});
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('employees');
	}
};