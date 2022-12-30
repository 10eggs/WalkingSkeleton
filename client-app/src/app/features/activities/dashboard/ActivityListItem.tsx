import React, { SyntheticEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Item, Label } from 'semantic-ui-react'
import { Activity } from '../../../models/activity'
import { useStore } from '../../../stores/store'

interface Props {
  activity: Activity
}

export default function ActivityListItem({activity}: Props) {

  const {activityStore} = useStore();
  const {deleteActivity, loading} = activityStore;

  const [target,setTarget] = useState('');

  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>,id: string){
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Item key={activity.id}>
              <Item.Content>
                <Item.Header as='a'>{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                  <div>{activity.description}</div>
                  <div>{activity.venue}</div>
                </Item.Description>
                <Item.Extra>
                  <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View' color='blue'></Button>
                  <Button name={activity.id} loading={loading && target === activity.id} onClick={(e)=>handleActivityDelete(e, activity.id)}floated='right' content='Delete' color='red'></Button>
                  <Label basic content={activity.category}></Label>
                </Item.Extra>
              </Item.Content>
            </Item>
  )
}