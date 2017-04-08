'use strict';
module.exports = function(sequelize, DataTypes) {
	var Feed = sequelize.define('Feed', {
		feedType: {field: 'feed_type', type: DataTypes.STRING},
		feedData: {field: 'feed_data' ,type: DataTypes.JSONB}
	}, {
		classMethods: {
			associate: function(models) {
        // associations can be defined here
			},
			getTransaction: () => {
				return sequelize.transaction();
			}
		}
	});
	return Feed;
};