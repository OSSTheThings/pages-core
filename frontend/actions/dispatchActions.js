import { reset } from 'redux-form';
import { dispatch } from '../store';
import {
  sitesFetchStarted as createSitesFetchStartedAction,
  sitesReceived as createSitesReceivedAction,
  siteAdded as createSiteAddedAction,
  siteUpdated as createSiteUpdatedAction,
  siteDeleted as createSiteDeletedAction,
  siteBasicAuthSaved as createSiteBasicAuthSavedAction,
  siteBasicAuthRemoved as createSiteBasicAuthRemovedAction,
} from './actionCreators/siteActions';
import {
  showAddNewSiteFields as createShowAddNewSiteFieldsAction,
  hideAddNewSiteFields as createHideAddNewSiteFieldsAction,
} from './actionCreators/addNewSiteFieldsActions';

const dispatchSitesFetchStartedAction = () => {
  dispatch(createSitesFetchStartedAction());
};

const dispatchSitesReceivedAction = (sites) => {
  dispatch(createSitesReceivedAction(sites));
};

const dispatchSiteAddedAction = (site) => {
  dispatch(createSiteAddedAction(site));
};

const dispatchSiteUpdatedAction = (site) => {
  dispatch(createSiteUpdatedAction(site));
};

const dispatchSiteDeletedAction = (siteId) => {
  dispatch(createSiteDeletedAction(siteId));
};

const dispatchShowAddNewSiteFieldsAction = () => {
  dispatch(createShowAddNewSiteFieldsAction());
};

const dispatchHideAddNewSiteFieldsAction = () => {
  dispatch(createHideAddNewSiteFieldsAction());
};

const dispatchSiteBasicAuthRemovedAction = (site) =>
  dispatch(createSiteBasicAuthRemovedAction(site));

const dispatchSiteBasicAuthSavedAction = (site) =>
  dispatch(createSiteBasicAuthSavedAction(site));

const dispatchResetFormAction = (formName) => dispatch(reset(formName));

export {
  dispatchSitesFetchStartedAction,
  dispatchSitesReceivedAction,
  dispatchSiteAddedAction,
  dispatchSiteUpdatedAction,
  dispatchSiteDeletedAction,
  dispatchShowAddNewSiteFieldsAction,
  dispatchHideAddNewSiteFieldsAction,
  dispatchResetFormAction,
  dispatchSiteBasicAuthRemovedAction,
  dispatchSiteBasicAuthSavedAction,
};
