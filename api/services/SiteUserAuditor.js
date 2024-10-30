const Sequelize = require('sequelize');
const { User, Site, Event } = require('../models');
const GitHub = require('./GitHub');
const { logger } = require('../../winston');
const UserActionCreator = require('./UserActionCreator');
const EventCreator = require('./EventCreator');

const auditUser = (user, auditor) => {
  let repos;
  return GitHub.getRepositories(user.githubAccessToken)
    .then((_repos) => {
      repos = _repos;
      return user.getSites();
    })
    .then((sites) => {
      const removed = [];
      sites.forEach((site) => {
        const fullName = [site.owner, site.repository].join('/').toUpperCase();
        const repoFound = repos.find((repo) => repo.full_name.toUpperCase() === fullName);
        if (!repoFound || !repoFound.permissions.push) {
          // site does not have push permissions
          const r = site
            .removeUser(user)
            .then(() =>
              UserActionCreator.addRemoveAction({
                userId: auditor.id,
                targetId: user.id,
                targetType: 'user',
                siteId: site.id,
              }),
            )
            .then(() => {
              const message =
                'Removed user from site. User does not have write permisisons';
              EventCreator.audit(Event.labels.SITE_USER, user, message, {
                siteId: site.id,
              });
            });
          removed.push(r);
        }
      });
      return Promise.all(removed);
    });
};

const auditAllUsers = () => {
  let auditor;
  return User.findOne({
    where: {
      username: process.env.USER_AUDITOR,
    },
  })
    .then((model) => {
      auditor = model;
      return User.findAll({
        attributes: ['id', 'username', 'githubAccessToken', 'signedInAt'],
        where: {
          githubAccessToken: {
            [Sequelize.Op.ne]: null,
          },
          signedInAt: {
            [Sequelize.Op.ne]: null,
          },
        },
        order: [['signedInAt', 'DESC']],
      });
    })
    .then((users) => Promise.all(users.map((user) => auditUser(user, auditor))));
};

const auditSite = (auditor, site, userIndex = 0) => {
  let collaborators;
  const user = site.Users[userIndex];
  if (!user) {
    return Promise.resolve();
  }

  return GitHub.getCollaborators(user.githubAccessToken, site.owner, site.repository)
    .then((collabs) => {
      collaborators = collabs;
    })
    .catch(logger.warn)
    .then(() => {
      if (collaborators && collaborators.length > 0) {
        const pushCollabs = collaborators
          .filter((c) => c.permissions.push)
          .map((c) => c.login.toLowerCase());
        const usersToRemove = site.Users.filter((u) => !pushCollabs.includes(u.username));
        const removed = [];
        usersToRemove.forEach((u) => {
          const r = site
            .removeUser(u)
            .then(() =>
              UserActionCreator.addRemoveAction({
                userId: auditor.id,
                targetId: u.id,
                targetType: 'user',
                siteId: site.id,
              }),
            )
            .then(() => {
              EventCreator.audit(
                Event.labels.SITE_USER,
                user,
                'Removed user from site. User does not have write permissions',
                {
                  siteId: site.id,
                },
              );
            });

          removed.push(r);
        });
        return Promise.all(removed);
      }
      return auditSite(auditor, site, userIndex + 1);
    });
};

const auditAllSites = async () => {
  const auditor = await User.findOne({
    where: {
      username: process.env.USER_AUDITOR,
    },
  });
  const sites = await Site.findAll({
    attributes: ['id', 'owner', 'repository'],
    include: [
      {
        model: User.scope('withGithub'),
        attributes: ['id', 'username', 'githubAccessToken', 'signedInAt'],
      },
    ],
    order: [[User, 'signedInAt', 'DESC']],
  });
  const auditedSites = sites.map((site) => auditSite(auditor, site));
  return Promise.allSettled(auditedSites);
};

module.exports = {
  auditAllUsers,
  auditAllSites,
  auditUser,
};
