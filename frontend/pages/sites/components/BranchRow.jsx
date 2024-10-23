import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import BranchViewLink from '@shared/branchViewLink';

import { SITE } from '../../../propTypes';

function BranchFilesLink({ branch }) {
  const href = `/sites/${branch.site.id}/published/${branch.name}`;
  return <Link to={href}>View files</Link>;
}

BranchFilesLink.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  branch: PropTypes.object,
};

export default function BranchRow({ branch, site }) {
  return (
    <tr key={branch.name}>
      <td>{branch.name}</td>
      <td>
        <ul className="usa-list--unstyled">
          <li>
            <BranchViewLink branchName={branch.name} site={site} />
          </li>
          <li>
            <BranchFilesLink branch={branch} />
          </li>
        </ul>
      </td>
    </tr>
  );
}

BranchRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  branch: PropTypes.object,
  site: SITE,
};
