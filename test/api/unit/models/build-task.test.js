const { expect } = require('chai');
const sinon = require('sinon');
const { DatabaseError, ValidationError } = require('sequelize');
const BuildTaskQueue = require('../../../../api/services/BuildTaskQueue');
const factory = require('../../support/factory');
const { Build, Site, BuildTask } = require('../../../../api/models');
const config = require('../../../../config');

describe('Build Task model', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('enqueue', () => {
    it('should send a new build task message', async () => {
      const sendMessageStub = sinon.stub(BuildTaskQueue, 'sendTaskMessage');
      sendMessageStub.resolves();

      const site = await factory.site();
      const build = await factory.build({ site });
      const buildTaskType = await factory.buildTaskType();
      const buildTask = await factory.buildTask({ build, buildTaskTypeId: buildTaskType.id})
      await buildTask.enqueue();
      await buildTask.reload();

      const [queuedTask, priority] = sendMessageStub.getCall(0).args;

      // called with the right things
      expect(sendMessageStub.called).to.be.true;
      expect(queuedTask.id).to.equal(buildTask.id);
      expect(priority).to.equal(1);

      // reloaded task is queued
      expect(buildTask.status).to.equal(BuildTask.Statuses.Queued);

      // The task should include the site
      expect(queuedTask.Build.Site).to.be.an.instanceof(Site);
      expect(queuedTask.Build.Site.id).to.eq(site.id);
    });

    it('can receive a higher priority', async () => {
      const sendMessageStub = sinon.stub(BuildTaskQueue, 'sendTaskMessage');
      sendMessageStub.resolves();

      const site = await factory.site();
      let build = await factory.build({ site });
      const buildTaskType = await factory.buildTaskType();
      const buildTask = await factory.buildTask({ build, buildTaskTypeId: buildTaskType.id})

      // add N extra for the same site
      const N = 5;
      // eslint-disable-next-line no-unused-vars
      await Promise.all(Array(N).fill(0).map(async (_) => {
        build = await factory.build({ site });
        return factory.buildTask({ build, buildTaskTypeId: buildTaskType.id });
      }));

      // add two complete task to check our math (they shouldn't count in priority)
      build = await factory.build({ site });
      const successfulTask = await factory.buildTask({ build, buildTaskTypeId: buildTaskType.id });
      successfulTask.update({ status: BuildTask.Statuses.Success });

      build = await factory.build({ site });
      const errorTask = await factory.buildTask({ build, buildTaskTypeId: buildTaskType.id });
      errorTask.update({ status: BuildTask.Statuses.Error });

      await buildTask.enqueue();
      await buildTask.reload();

      const [queuedTask, priority] = sendMessageStub.getCall(0).args;

      // called with higher priority
      expect(sendMessageStub.called).to.be.true;
      expect(queuedTask.id).to.equal(buildTask.id);
      expect(priority).to.equal(N + 1);
    });
  });
});
