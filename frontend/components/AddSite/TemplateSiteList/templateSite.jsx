import React from 'react';
import PropTypes from 'prop-types';

import { ORGANIZATION } from '../../../propTypes';
import { getOrgId, getSafeRepoName } from '../../../util';
import UserOrgSelect from '../../organization/UserOrgSelect';

class TemplateSite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: props.defaultOwner,
      repository: '',
      template: props.templateKey,
      organizationId: '',
    };

    this.handleChooseActive = this.handleChooseActive.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { handleSubmit, orgData } = this.props;
    const { repository, organizationId } = this.state;

    const organization = getOrgId(organizationId, orgData);
    const safeRepository = getSafeRepoName(repository);
    const site = {
      ...this.state,
      organizationId: organization,
      repository: safeRepository,
    };

    handleSubmit(site);
  }

  handleChooseActive() {
    const { index, handleChooseActive } = this.props;
    handleChooseActive(index);
  }

  getFormVisible() {
    const { active, index } = this.props;
    return active === index;
  }

  render() {
    const {
      description, example, orgData, thumb, title,
    } = this.props;
    const { owner, organizationId, repository } = this.state;

    return (
      <div className="federalist-template-list-item">
        <div className="federalist-template-list-item-img">
          <img
            data-action="name-site"
            className="thumbnail"
            src={thumb}
            alt={`Thumbnail screenshot for the ${title} template`}
          />

        </div>
        <div className="federalist-template-list-item-content">
          <h3 className="federalist-template-title">{title}</h3>
          <p>{description}</p>
          {this.getFormVisible()
            ? (
              <form
                className="new-site-form"
                onSubmit={this.handleSubmit}
              >
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="owner">What GitHub account will own your site?</label>
                <input
                  id="owner"
                  name="owner"
                  type="text"
                  value={owner}
                  onChange={this.handleChange}
                />
                {
                  orgData ? (
                    <div className="form-group">
                      <UserOrgSelect
                        id="organizationId"
                        name="organizationId"
                        value={organizationId}
                        onChange={this.handleChange}
                        orgData={orgData}
                      />
                    </div>
                  ) : null
                }
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="repository">Name your new site</label>
                <input
                  id="repository"
                  name="repository"
                  type="text"
                  value={repository}
                  onChange={this.handleChange}
                />
                <input type="submit" className="usa-button usa-button-primary" value="Create site" />
              </form>
            )
            : null}
          {!this.getFormVisible()
            && (
            <div>
              <a
                href={example}
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                className="view-template-link"
              >
                View sample
              </a>
              <br />
              <button
                className="usa-button"
                onClick={this.handleChooseActive}
                type="button"
              >
                Use this template
              </button>
            </div>
            )}
        </div>
      </div>
    );
  }
}

TemplateSite.propTypes = {
  templateKey: PropTypes.string.isRequired,
  defaultOwner: PropTypes.string.isRequired,
  example: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumb: PropTypes.string.isRequired,
  active: PropTypes.number.isRequired,
  handleChooseActive: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  orgData: PropTypes.arrayOf(ORGANIZATION).isRequired,
};

export default TemplateSite;
