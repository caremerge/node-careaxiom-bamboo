'use strict';
const Promise = require('bluebird');
module.exports = function(sequelize, DataTypes) {
	let classMethods = {
		associate: function() {
			// associations can be defined here
		},
		findAllByName: function({employeeNames}) {
			let _find = (name) => {
				return this.find({
					where: {
						data: {
							displayName: name
						}
					}
				});
			};
			return Promise.map(employeeNames, _find);
		}
	};
	let getterMethods = {
		anniversaryCount: function() {
			return this.getDataValue('anniversaryCount');
		},
		name: function() {
			return this.getDataValue('data').displayName;
		},
		email: function() {
			return this.getDataValue('data').workEmail;
		}
	};
	let setterMethods = {
		anniversaryCount: function(value) {
			this.setDataValue('anniversaryCount', value);
		}
	};
	var employee = sequelize.define('employee', {
		employeeId: DataTypes.INTEGER,
		data: DataTypes.JSONB
	}, {
		classMethods: classMethods,
		getterMethods: getterMethods,
		setterMethods: setterMethods
	});
	return employee;
};