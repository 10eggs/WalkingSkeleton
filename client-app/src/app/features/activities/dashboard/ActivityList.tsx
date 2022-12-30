import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Button, Header, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import ActivityListItem from './ActivityListItem';


export default observer(function ActivityList(){

  const {activityStore} = useStore();
  const {groupedActivities} = activityStore;

  return(
    <>
      {groupedActivities.map(([group,activities]) => {
        return <Fragment key={group}>
          <Header sub colot='teal'>
            {group}
          </Header>
              {activities.map(activity=>(
                <ActivityListItem key={activity.id} activity={activity}/>            
              ))}
        </Fragment>
      })}
    </>
  )
})