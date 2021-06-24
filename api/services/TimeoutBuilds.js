const moment = require('moment');
const { Op } = require('sequelize');
const { zip } = require('underscore');

const { Build } = require('../models');
const CFApi = require('../utils/cfApiClient');

const TIMEOUT = process.env.BUILD_TIMEOUT || 45;

const timeoutBuilds = async (date = new Date()) => {
  const cfApi = new CFApi();

  const now = moment(date);
  const buildTimout = now.clone().subtract(TIMEOUT, 'minutes');
  const taskTimeout = now.clone().subtract(5, 'minutes');

  const atts = {
    error: 'The build timed out',
    state: Build.States.Error,
    completedAt: now.toDate(),
  };

  const options = {
    where: {
      [Op.or]: [

        /*
          The garden build itself should timout builds once they start, but just in case
        */
        {
          state: Build.States.Processing,
          startedAt: {
            [Op.lt]: buildTimout.toDate(),
          },
        },

        /*
          The builder created the cloud foundry task but the garden build failed
          before starting the build
        */
        {
          state: Build.States.Tasked,
          updatedAt: {
            [Op.lt]: taskTimeout.toDate(),
          },
        },
      ],
    },
    returning: ['id'],
  };

  const [, builds] = await Build.update(atts, options);
  const buildIds = builds.map(b => b.id);
  const cancels = await Promise.allSettled(buildIds.map(buildId => cfApi.cancelBuildTask(buildId)));
  return zip(buildIds, cancels);
};

module.exports = { timeoutBuilds };
