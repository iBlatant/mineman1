/**
 * @file streamerRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let description, color;

    if (args.role) {
      if (parseInt(args.message) >= 9223372036854775807) {
        /**
         * The command was ran with invalid parameters.
         * @fires commandUsage
         */
        return Bastion.emit('commandUsage', message, this.help);
      }

      let role = message.guild.roles.get(args.role);
      if (!role) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
      }

      await Bastion.db.run(`UPDATE guildSettings SET streamerRole='${role.id}' WHERE guildID=${message.guild.id}`);
      description = `${role.name} has been set as the streamer role.`;
      color = Bastion.colors.GREEN;
    }
    else if (args.remove) {
      await Bastion.db.run(`UPDATE guildSettings SET streamerRole=null WHERE guildID=${message.guild.id}`);
      description = 'The streamer role has been removed.';
      color = Bastion.colors.RED;
    }
    else {
      let guildSettings = await Bastion.db.get(`SELECT streamerRole FROM guildSettings WHERE guildID=${message.guild.id}`);
      if (guildSettings.streamerRole) {
        let streamerRole = message.guild.roles.get(guildSettings.streamerRole);
        if (streamerRole) {
          description = `The current streamer role is **${streamerRole.name}**`;
          color = Bastion.colors.BLUE;
        }
        else {
          description = `No role in your server has been set as the streamer role. To set a role as the streamer role, run the command \`${this.help.name} [ROLE_ID]\`.`;
          color = Bastion.colors.RED;
        }
      }
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamerRole',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'streamerRole [ROLE_ID] [--remove]',
  example: [ 'streamerRole', 'streamerRole 265419266104885248', 'streamerRole --remove' ]
};
