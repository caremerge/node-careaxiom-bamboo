'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
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
			if (_.isEmpty(_.compact(employeeNames))) {
				return [];
			}
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
		},
		timeOff: function() {
			let desc =  this.getDataValue('timeOff');
			if (_.isEmpty(desc)) {
				return undefined;
			}
			return {
				type: desc.split('-')[0].trim(),
				duration: desc.split('-')[1].trim()
			};
		}
	};
	let setterMethods = {
		anniversaryCount: function(value) {
			this.setDataValue('anniversaryCount', value);
		},
		timeOff: function(value) {
			this.setDataValue('timeOff', value);
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