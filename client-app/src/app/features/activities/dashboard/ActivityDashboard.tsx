import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../layout/LoadingComponents';
import { useStore } from '../../../stores/store';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {

  const {activityStore} = useStore();
  const {selectedActivity, editMode} = activityStore;

  useEffect(()=>{
    activityStore.loadActivities();
  },[activityStore]);


  if(activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>


  return(
    <Grid width='10'>
      <Grid.Column width='10'>
        <ActivityList></ActivityList>
      </Grid.Column>
      <Grid.Column width='6'>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  )
})