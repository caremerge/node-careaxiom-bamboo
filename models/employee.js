'use strict';
module.exports = function(sequelize, DataTypes) {
	var employee = sequelize.define('employee', {
		employeeId: DataTypes.INTEGER,
		data: DataTypes.JSONB
	}, {
		classMethods: {
			associate: function() {
				// associations can be defined here
			}
		}
	});
	return employee;
};