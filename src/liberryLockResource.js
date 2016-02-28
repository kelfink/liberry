// ============================
// Lock  Resource for liberry
// ============================
// var parseUsers = function(jsonBody) {
    // var users = {};
	// var userlistResponse = JSON.parse(jsonBody);
	// userlistResponse.members.forEach(function(member) {
	  // users[member.id] = member;
	// });
    // return users;
//}

var lockResource = function (bot, message, params) {
	var pg = require('pg');
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query("UPDATE resources set checkedout_to_id = $2 where checkedout_to_id IS NULL AND name = $1", [params.resource_name, message.user], function(err, result) {
				done();
				if (err) {
				  console.error(err);
				    return;
				} else {
				  // Check to see if we updated
				  if (result.rowCount == 0) {
				    client.query('SELECT * FROM resources where name = $1', [params.resource_name], function(err, result) {
					  done();
					  if (err) {
					    bot.reply(message, 'Error finding resource ' + err);
					    console.error(err);
					    return;
					  } else {
					    if (result.rows.length == 0) {
					      bot.reply(message, "I couldn't find resource " + params.resource_name);
					     return;
			            } else {
                          if (message.user == result.rows[0].checkedout_to_id) {
				            bot.reply(message, "You already have Resource " + params.resource_name + " checked out.");
                          } else {
				            bot.reply(message, "Resource " + params.resource_name + " is already locked by " + result.rows[0].checkedout_to_id);
                          }
			            }
					  }
					});	
				  } else {
					bot.reply(message, "Resource " + params.resource_name + " is checked out to you, " + message.user );
				  }
				}
              }
	);
	});
}

module.exports = {
  lockResource: lockResource
}