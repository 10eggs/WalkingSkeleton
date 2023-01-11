import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../layout/LoadingComponents';
import { useStore } from '../../../stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {

  const {activityStore} = useStore();
  const {loadActivities, activityRegistry} = activityStore;
  const {selectedActivity, editMode} = activityStore;

  useEffect(()=>{
    if(activityRegistry.size <= 1) loadActivities();
  },[loadActivities,activityRegistry.size]);


  if(activityStore.loadingInitial) return <LoadingComponent content='Loading activities...'/>
    return(
    <Grid width='10'>
      <Grid.Column width='10'>
        <ActivityList></ActivityList>
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilters/>
      </Grid.Column>
    </Grid>
  )
})