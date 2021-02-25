const role = 'role';
const ROLE_TABLE = {
  id: { type: 'int', primaryKey: true, autoIncrement: true },
  name: { type: 'string', notNull: true, unique: true },
  createdAt: { type: 'date', notNull: true },
  updatedAt: { type: 'date', notNull: true },
};

const organization = 'organization';
const ORGANIZATION_TABLE = {
  id: { type: 'int', primaryKey: true, autoIncrement: true },
  name: { type: 'string', notNull: true, unique: true },
  createdAt: { type: 'date', notNull: true },
  updatedAt: { type: 'date', notNull: true },
};

const organizationRole = 'organization_role';
const ORGANIZATION_ROLE_TABLE = {
  id: { type: 'int', primaryKey: true, autoIncrement: true },
  organizationId: {
    type: 'int',
    notNull: true,
    foreignKey: {
      name: 'organization_id_fk',
      table: 'organization',
      mapping: 'id',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
    },
  },
  userId: {
    type: 'int',
    notNull: true,
    foreignKey: {
      name: 'user_id_fk',
      table: 'user',
      mapping: 'id',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
    },
  },
  roleId: {
    type: 'int',
    notNull: true,
    foreignKey: {
      name: 'role_id_fk',
      table: 'role',
      mapping: 'id',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
    },
  },
  createdAt: { type: 'date', notNull: true },
  updatedAt: { type: 'date', notNull: true },
};

exports.up = async db => {
  await db.createTable(role, ROLE_TABLE);
  await db.createTable(organization, ORGANIZATION_TABLE);
  await db.createTable(organizationRole, ORGANIZATION_ROLE_TABLE);
  return db.addIndex(organizationRole, 'organization_role_organization_user_idx', ['organizationId', 'userId'], true);
};

exports.down = async db => {
  await db.dropTable(organizationRole);
  await db.dropTable(organization);
  return db.dropTable(role);
};
