import React from 'react';
import PropTypes from 'prop-types';

import BranchRow from './BranchRow';
import globals from '../../../globals';
import { SITE } from '../../../propTypes';

export default function BranchesTable({ branches, site }) {
  return (
    <div>
      <p>
        Use this page to see every version of your site&apos;s code published on
        {` ${globals.APP_NAME} `}
        and to audit the specific files that
        {` ${globals.APP_NAME} `}
        has published.
      </p>
      <table className="usa-table usa-table--borderless usa-table--stacked published-branch-table log-table width-full table-full-width">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { branches.map(branch => <BranchRow branch={branch} site={site} />) }
        </tbody>
      </table>
    </div>
  );
}

BranchesTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  branches: PropTypes.array,
  site: SITE,
};
