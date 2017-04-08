'use strict';
module.exports = function(sequelize, DataTypes) {
	var Feed = sequelize.define('Feed', {
		feed_type: DataTypes.STRING,
		feed_data: DataTypes.JSONB
	}, {
		classMethods: {
			associate: function(models) {
        // associations can be defined here
			}
		}
	});
	return Feed;
};