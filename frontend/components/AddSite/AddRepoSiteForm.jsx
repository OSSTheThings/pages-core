import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { ORGANIZATION } from '../../propTypes';
import GitHubRepoUrlField from '../Fields/GitHubRepoUrlField';
import UserOrgSelect from '../organization/UserOrgSelect';
import SelectSiteEngine from '../SelectSiteEngine';
import AlertBanner from '../alertBanner';

const showNewSiteAlert = () => {
  const message = (
    <span>
      Looks like this site is completely new to Federalist!
      <br />
      Please fill out these additional fields to complete the process.
    </span>
  );

  return <AlertBanner status="info" header="New Site" message={message} />;
};

export const AddRepoSiteForm = ({
  // even though initialValues is not directly used, it is used
  // by reduxForm, and we want PropType validation on it, so we'll
  // keep it here but disable the eslint rule below
  initialValues, // eslint-disable-line no-unused-vars
  pristine,
  handleSubmit,
  orgData,
  showAddNewSiteFields,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <GitHubRepoUrlField
        label="Already have a GitHub repo for your site? Paste the URL here."
        name="repoUrl"
        id="repoUrl"
        placeholder="https://github.com/owner/repository"
        className="form-control"
        readOnly={showAddNewSiteFields}
      />
      {
        orgData ? (
          <div className="form-group">
            <Field
              name="siteOrganizationId"
              component={p => (
                <UserOrgSelect
                  id="siteOrganizationId"
                  name="siteOrganizationId"
                  value={p.input.value}
                  onChange={p.input.onChange}
                  orgData={orgData}
                />
              )}
            />
          </div>
        ) : null
      }
    </div>
    {
      showAddNewSiteFields && (
      <div className="add-repo-site-additional-fields">
        {showNewSiteAlert()}
        <div className="form-group">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="engine">Site engine</label>
          <Field
            name="engine"
            component={p => (
              <SelectSiteEngine
                name="engine"
                id="engine"
                value={p.input.value}
                onChange={p.input.onChange}
                className="form-control"
              />
            )}
          />
        </div>
      </div>
      )
}
    <button
      type="submit"
      className="usa-button usa-button-primary"
      style={{ display: 'inline-block' }}
      disabled={pristine}
    >
      Add repository-based site
    </button>
  </form>
);

AddRepoSiteForm.propTypes = {
  orgData: PropTypes.arrayOf(ORGANIZATION).isRequired,
  showAddNewSiteFields: PropTypes.bool,
  initialValues: PropTypes.shape({
    engine: PropTypes.string.isRequired,
    siteOrganizationId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }).isRequired,
  // the following props are from reduxForm:
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

AddRepoSiteForm.defaultProps = {
  showAddNewSiteFields: false,
};

// create a higher-order component with reduxForm and export that
export default reduxForm({ form: 'addRepoSite' })(AddRepoSiteForm);
